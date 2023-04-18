"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.code ? (err.code === 11000 ? 400 : err.code) : 500);
    res.json({ message: err.message || "An unknown error occurred!" });
};
exports.default = errorHandler;
