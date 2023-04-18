"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUserHandler = exports.refreshUserHandler = exports.loginUserHandler = exports.registerUserHandler = void 0;
const http_error_1 = __importDefault(require("../model/http-error"));
const auth_service_1 = require("../service/auth.service");
const mailer_1 = __importDefault(require("../utils/mailer"));
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../service/user.service");
const registerUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = "Invalid password or email! please check your credentials";
    const body = req.body;
    const user = yield (0, auth_service_1.registerUser)(body);
    if (!user) {
        return next(new http_error_1.default(message, 401));
    }
    const accessToken = (0, jwt_1.signJwt)({
        UserInfo: {
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    }, "accessTokenSecret", { expiresIn: "25s" });
    const refreshToken = (0, jwt_1.signJwt)({ _id: user._id }, "refreshTokenSecret", {
        expiresIn: "2m",
    });
    res.cookie("myRefreshTokenCookie", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 1000,
    });
    yield (0, mailer_1.default)({
        from: "test@example.com",
        to: user.email,
        subject: "Please verify your account",
        text: `Verification code ${user.verificationCode}, Id:${user._id}`,
        html: `<a href="${process.env.BASE_URL}/users/verify/${user._id}/${user.verificationCode}">Click to Verify your Account</a>`,
    });
    res.json({ accessToken });
});
exports.registerUserHandler = registerUserHandler;
const loginUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = "Invalid password or email! please check your credentials";
    const { email, password } = req.body;
    const user = yield (0, auth_service_1.loginUser)(email);
    if (!user) {
        return next(new http_error_1.default(message, 401));
    }
    if (!user.verified) {
        return next(new http_error_1.default("Verification Error - Please verify your account", 401));
    }
    const match = yield user.validatePassword(password);
    if (!match) {
        return next(new http_error_1.default(message, 401));
    }
    const accessToken = (0, jwt_1.signJwt)({
        UserInfo: {
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    }, "accessTokenSecret", { expiresIn: "25s" });
    const refreshToken = (0, jwt_1.signJwt)({ _id: user._id }, "refreshTokenSecret", {
        expiresIn: "2m",
    });
    res.cookie("myRefreshTokenCookie", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 1000,
    });
    res.json({ accessToken });
});
exports.loginUserHandler = loginUserHandler;
const refreshUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    console.log(cookies);
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.myRefreshTokenCookie)) {
        return next(new http_error_1.default("Unauthorized", 401));
    }
    const refreshToken = cookies.myRefreshTokenCookie;
    let decoded;
    try {
        decoded = (0, jwt_1.verifyJwt)(refreshToken, "refreshTokenSecret");
    }
    catch (error) {
        return next(new http_error_1.default("Forbidden Route", 403));
    }
    const user = yield (0, user_service_1.findUserById)(decoded._id);
    if (!user)
        return next(new http_error_1.default("Unauthorized", 401));
    const accessToken = (0, jwt_1.signJwt)({
        UserInfo: {
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    }, "accessTokenSecret", { expiresIn: "25s" });
    res.json({ accessToken });
});
exports.refreshUserHandler = refreshUserHandler;
const logoutUserHandler = (req, res) => {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.myRefreshTokenCookie)) {
        res.sendStatus(204);
        return;
    }
    res.clearCookie("myRefreshTokenCookie", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 1000,
    });
    res.json({ message: "Cookies cleared" });
};
exports.logoutUserHandler = logoutUserHandler;
