import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, FuelType, TransmissionType } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.development") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const cities = [
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Delhi", state: "Delhi" },
];

const sublocations: Record<
  string,
  { name: string; address: string; latitude: number; longitude: number }[]
> = {
  Bengaluru: [
    {
      name: "Kempegowda International Airport",
      address: "Devanahalli, Bengaluru 562300",
      latitude: 13.1979,
      longitude: 77.7063,
    },
    {
      name: "Indiranagar",
      address: "100 Feet Rd, Indiranagar, Bengaluru 560038",
      latitude: 12.9784,
      longitude: 77.6408,
    },
    {
      name: "HSR Layout",
      address: "HSR Layout, Bengaluru 560102",
      latitude: 12.9116,
      longitude: 77.6389,
    },
    {
      name: "Jayanagar",
      address: "11th Main Rd, Jayanagar, Bengaluru 560041",
      latitude: 12.9308,
      longitude: 77.5838,
    },
    {
      name: "Marathahalli",
      address: "Marathahalli Bridge, Bengaluru 560037",
      latitude: 12.9591,
      longitude: 77.6974,
    },
  ],
  Mumbai: [
    {
      name: "Chhatrapati Shivaji Maharaj International Airport",
      address: "Santacruz East, Mumbai 400099",
      latitude: 19.0896,
      longitude: 72.8656,
    },
    {
      name: "Bandra Kurla Complex",
      address: "BKC, Bandra East, Mumbai 400051",
      latitude: 19.0665,
      longitude: 72.8695,
    },
    {
      name: "Andheri West",
      address: "Andheri West, Mumbai 400058",
      latitude: 19.1197,
      longitude: 72.8468,
    },
    {
      name: "Lower Parel",
      address: "Lower Parel, Mumbai 400013",
      latitude: 18.9999,
      longitude: 72.8327,
    },
  ],
  Hyderabad: [
    {
      name: "Rajiv Gandhi International Airport",
      address: "Shamshabad, Hyderabad 501504",
      latitude: 17.2403,
      longitude: 78.4294,
    },
    {
      name: "Hitech City",
      address: "HITEC City, Hyderabad 500081",
      latitude: 17.4474,
      longitude: 78.3762,
    },
    {
      name: "Gachibowli",
      address: "Gachibowli, Hyderabad 500032",
      latitude: 17.4401,
      longitude: 78.3489,
    },
    {
      name: "Banjara Hills",
      address: "Road No 12, Banjara Hills, Hyderabad 500034",
      latitude: 17.4156,
      longitude: 78.4347,
    },
  ],
  Chennai: [
    {
      name: "Chennai International Airport",
      address: "Meenambakkam, Chennai 600027",
      latitude: 12.9941,
      longitude: 80.1709,
    },
    {
      name: "T Nagar",
      address: "T Nagar, Chennai 600017",
      latitude: 13.0418,
      longitude: 80.2341,
    },
    {
      name: "Velachery",
      address: "Velachery, Chennai 600042",
      latitude: 12.9774,
      longitude: 80.2222,
    },
  ],
  Delhi: [
    {
      name: "Indira Gandhi International Airport",
      address: "Palam, New Delhi 110037",
      latitude: 28.5562,
      longitude: 77.1,
    },
    {
      name: "Connaught Place",
      address: "Connaught Place, New Delhi 110001",
      latitude: 28.6315,
      longitude: 77.2167,
    },
    {
      name: "Hauz Khas",
      address: "Hauz Khas, New Delhi 110016",
      latitude: 28.5494,
      longitude: 77.2001,
    },
  ],
};

const carTemplates = [
  {
    name: "Tata Tigor",
    brand: "Tata",
    model: "Tigor",
    year: "2023",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 85,
    pricePerDay: 1299,
    extraKmCharge: 12,
    features: ["AC", "Bluetooth", "Power Windows", "ABS", "Rear Camera"],
    images: [
      "https://sslphotos.jato.com/PHOTO400/SSCIND/TATA/TIGOR/2023/4SA.JPG",
    ],
  },
  {
    name: "Maruti Swift",
    brand: "Maruti",
    model: "Swift",
    year: "2024",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.MANUAL,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 80,
    pricePerDay: 1199,
    extraKmCharge: 12,
    features: ["AC", "Bluetooth", "Android Auto", "ABS", "Reverse Camera"],
    images: [
      "https://sslphotos.jato.com/PHOTO400/SSCIND/MARUTI/S20SUZUKI/SWIFT/2023/5HA.JPG",
    ],
  },
  {
    name: "Hyundai Exter",
    brand: "Hyundai",
    model: "Exter",
    year: "2024",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 5,
    kmLimitPerDay: 350,
    pricePerHour: 95,
    pricePerDay: 1399,
    extraKmCharge: 15,
    features: ["AC", "Cruise Control", "Sunroof", "ABS", "Rear Camera"],
    images: [
      "https://sslphotos.jato.com/PHOTO400/SSCIND/HYUNDAI/EXTER/2023/50D.JPG",
    ],
  },
  {
    name: "Toyota Glanza",
    brand: "Toyota",
    model: "Glanza",
    year: "2023",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 105,
    pricePerDay: 1499,
    extraKmCharge: 15,
    features: ["AC", "Bluetooth", "Touchscreen", "ABS", "Parking Sensors"],
    images: [
      "https://sslphotos.jato.com/PHOTO400/SSCIND/TOYOTA/GLANZA/2023/5HA.JPG",
    ],
  },
  {
    name: "Mahindra Thar",
    brand: "Mahindra",
    model: "Thar",
    year: "2023",
    fuelType: FuelType.DIESEL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 4,
    kmLimitPerDay: 250,
    pricePerHour: 150,
    pricePerDay: 2499,
    extraKmCharge: 20,
    features: ["AC", "4x4", "Bluetooth", "ABS"],
    images: [
      "https://images.unsplash.com/photo-1698651810052-16fc7f7941ce?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    name: "Hyundai Creta",
    brand: "Hyundai",
    model: "Creta",
    year: "2024",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 130,
    pricePerDay: 1999,
    extraKmCharge: 18,
    features: ["AC", "Sunroof", "Touchscreen", "ABS", "Airbags"],
    images: [
      "https://images.unsplash.com/photo-1619362280286-f1f8fd5032ed?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    name: "Toyota Innova Crysta",
    brand: "Toyota",
    model: "Innova",
    year: "2023",
    fuelType: FuelType.DIESEL,
    transmission: TransmissionType.MANUAL,
    seats: 7,
    kmLimitPerDay: 300,
    pricePerHour: 180,
    pricePerDay: 2999,
    extraKmCharge: 25,
    features: ["AC", "7 Seater", "ABS", "Rear AC Vents"],
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    name: "Kia Seltos",
    brand: "Kia",
    model: "Seltos",
    year: "2023",
    fuelType: FuelType.PETROL,
    transmission: TransmissionType.AUTOMATIC,
    seats: 5,
    kmLimitPerDay: 300,
    pricePerHour: 125,
    pricePerDay: 1899,
    extraKmCharge: 18,
    features: ["AC", "Bluetooth", "Sunroof", "ABS", "Rear Camera"],
    images: [
      "https://images.unsplash.com/photo-1623816409748-0382894563a6?auto=format&fit=crop&q=80&w=800",
    ],
  },
];

async function main() {
  console.log("🚀 Starting seed...");

  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.sublocation.deleteMany();
  await prisma.city.deleteMany();

  console.log("🧹 Cleared existing data");

  let carCounter = 1;

  for (const cityData of cities) {
    const city = await prisma.city.create({ data: cityData });
    console.log(`✅ Created city: ${city.name}`);

    const baseSublocations = sublocations[cityData.name] ?? [];

    // We want 15 sublocations per city to reach 75 total (5 cities * 15)
    // We already have some hardcoded, we will generate the rest.
    const subsToCreate = 15;

    for (let i = 0; i < subsToCreate; i++) {
      let subData;
      if (i < baseSublocations.length) {
        subData = baseSublocations[i];
      } else {
        const baseLat = baseSublocations[0]?.latitude || 20.0;
        const baseLng = baseSublocations[0]?.longitude || 77.0;
        subData = {
          name: `${city.name} Pickup Point ${i + 1}`,
          address: `Pickup Point ${i + 1}, ${city.name}`,
          latitude: baseLat + (Math.random() - 0.5) * 0.15,
          longitude: baseLng + (Math.random() - 0.5) * 0.15,
        };
      }

      const sublocation = await prisma.sublocation.create({
        data: {
          name: subData.name,
          address: subData.address,
          latitude: subData.latitude,
          longitude: subData.longitude,
          cityId: city.id,
        },
      });

      // Let's create 4 cars per sublocation (15 * 4 = 60 cars per city, 5 * 60 = 300 total)
      const carsToCreate = 4;
      const carsData = [];

      for (let j = 0; j < carsToCreate; j++) {
        const template = carTemplates[carCounter % carTemplates.length];
        carsData.push({
          ...template,
          registrationNo: `KA${String(carCounter).padStart(5, "0")}`,
          sublocationId: sublocation.id,
        });
        carCounter++;
      }

      await prisma.car.createMany({
        data: carsData,
      });
    }

    console.log(`🚗 Created 15 sublocations + 60 cars for ${city.name}`);
  }

  const totalCars = await prisma.car.count();
  const totalSubs = await prisma.sublocation.count();

  console.log("\n✅ Seed complete!");
  console.log(`Cities: ${cities.length}`);
  console.log(`Sublocations: ${totalSubs}`);
  console.log(`Cars: ${totalCars}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
