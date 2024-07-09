import mongoose from "mongoose";

export default async function connectDB() {
  console.info("[mongo] Connecting...");

  if (!process.env.MONGODB_URI) throw new Error("No MONGODB_URI defined");

  const mongo = await mongoose.connect(process.env.MONGODB_URI);
  /**@todo: remove */
  console.log(
    "mongo.connection.readyState -----> ",
    mongo.connection.readyState
  );

  console.info("Mongo connected!");
}
