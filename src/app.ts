require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import router from "./routes";

const PORT = config.get("PORT");

const app = express();

app.use(router);

app.listen(PORT, () => {
  console.log(`App started listening on Port : ${PORT}`);
  connectToDb();
});
