import mongoose from "mongoose";

export default async function connectDB() {
  console.info("[mongo] Connecting...");

  if (!process.env.MONGODB_URI) throw new Error("No MONGODB_URI defined");

  await mongoose.connect(process.env.MONGODB_URI);

  console.info("Mongo connected!");
}
