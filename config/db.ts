import mongoose from "mongoose";

export default async function connectDB() {
  if (!process.env.DATABASE_URL) throw new Error("No DATABASE_URL defined");

  await mongoose.connect(process.env.DATABASE_URL);

  console.info("Mongo connected!");
}
