import mongoose from "mongoose";

import config from "config";

async function connectToDb() {
  const dbUri = config.get<string>("DBURI");

  try {
    await mongoose.connect(dbUri);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
export default connectToDb;
