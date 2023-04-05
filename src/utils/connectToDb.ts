import mongoose from "mongoose";

import config from "config";

async function connectToDb() {
  const dbUri = config.get<string>("DBURI");

  try {
    await mongoose.connect(dbUri);
    console.log("Connected to DB");
  } catch (error) {
    process.exit(1);
  }
}
export default connectToDb;
