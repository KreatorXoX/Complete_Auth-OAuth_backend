"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const http_error_1 = __importDefault(require("../model/http-error"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
        return next(new http_error_1.default("Unauthorized", 401));
    }
    const accessToken = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyJwt)(accessToken, "accessTokenSecret");
        // req.user = decoded?.UserInfo._id;
        // req.isAdmin = decoded?.UserInfo.isAdmin;
        next();
    }
    catch (error) {
        return next(new http_error_1.default("Forbidden", 403));
    }
};
exports.default = verifyJWT;
