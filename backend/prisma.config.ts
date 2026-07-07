import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "@prisma/config";

const envFile =
  process.env.NODE_ENV == "production" ? ".env.production" : ".env.development";

dotenv.config({ path: path.resolve(__dirname, envFile) });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
