"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const connectToDb_1 = __importDefault(require("./utils/connectToDb"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || config_1.default.get("PORT");
const app = (0, express_1.default)();
(0, connectToDb_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    }
    else {
        res.type("txt").send("404 Not Found");
    }
});
app.use(errorHandler_1.default);
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
});
mongoose_1.default.connection.on("error", (err) => {
    console.log(err);
});
