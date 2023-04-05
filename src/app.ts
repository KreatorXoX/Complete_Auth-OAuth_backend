require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";

const PORT = config.get("PORT");

const app = express();

app.listen(PORT, () => {
  console.log(`App started listening on Port : ${PORT}`);
  connectToDb();
});
