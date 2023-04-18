import mongoose from "mongoose";

import config from "../config/default";

async function connectToDb() {
  const dbUri = config.DBURI!;

  try {
    await mongoose.connect(dbUri);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
export default connectToDb;
