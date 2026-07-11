import { prisma } from "../utils/prisma";

export const citiesService = {
  async getAllCities() {
    return prisma.city.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        state: true,
        _count: { select: { sublocations: true } },
      },
      orderBy: { name: "asc" },
    });
  },

  async getSublocations(cityId: string) {
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) throw new Error("City not found");

    return prisma.sublocation.findMany({
      where: { cityId, isActive: true },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        _count: { select: { cars: true } },
      },
      orderBy: { name: "asc" },
    });
  },
};
