import mongoose from "mongoose";
import { env } from "./env.js";

export interface DatabaseConfig {
  uri: string;
  dbName: string;
}

export const connectDatabase = async (
  config: DatabaseConfig = {
    uri: env.MONGODB_URI,
    dbName: env.MONGODB_DB_NAME,
  },
): Promise<void> => {
  await mongoose.connect(config.uri, {
    dbName: config.dbName,
    serverSelectionTimeoutMS: 5000,
  });
  console.log("Conexión con MongoDB establecida.");
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("Conexión con MongoDB cerrada.");
};
