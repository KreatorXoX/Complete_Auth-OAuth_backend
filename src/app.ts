require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import router from "./routes";
import errorHandler from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
const PORT = config.get("PORT");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(router);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App started listening on Port : ${PORT}`);
  connectToDb();
});
