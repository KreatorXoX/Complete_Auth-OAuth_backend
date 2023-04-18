require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import config from "config";
import connectToDb from "./utils/connectToDb";
import router from "./routes";
import errorHandler from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = process.env.PORT || config.get("PORT");
const app = express();

connectToDb();

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

app.use(router);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
