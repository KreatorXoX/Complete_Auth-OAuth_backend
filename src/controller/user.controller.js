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
exports.findUserByIdHandler = exports.findAllUsers = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.verifyUserHandler = void 0;
const uuid_1 = require("uuid");
const user_service_1 = require("../service/user.service");
const mailer_1 = __importDefault(require("../utils/mailer"));
const http_error_1 = __importDefault(require("../model/http-error"));
function verifyUserHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const verificationCode = req.params.verificationCode;
        // find the user by id and check to see if they are already verified
        const user = yield (0, user_service_1.findUserById)(id);
        if (!user) {
            return next(new http_error_1.default("Could not verify the user", 500));
        }
        if (user.verified) {
            return next(new http_error_1.default("User already verified", 400));
        }
        if (user.verificationCode !== verificationCode) {
            return next(new http_error_1.default("Verification code does not match / expired", 400));
        }
        user.verified = true;
        yield user.save();
        res.send("User verified");
    });
}
exports.verifyUserHandler = verifyUserHandler;
function forgotPasswordHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = "If a user with the provided email is registered, you will recieve a reset password link";
        const { email } = req.body;
        const user = yield (0, user_service_1.findUserByMail)(email);
        if (!user) {
            return next(new http_error_1.default("User not found", 404));
        }
        if (!user.verified) {
            return next(new http_error_1.default("User not verified", 400));
        }
        const passwordResetCode = (0, uuid_1.v4)();
        user.passwordResetCode = passwordResetCode;
        yield user.save();
        yield (0, mailer_1.default)({
            to: user.email,
            from: "text@example.com",
            subject: "Reset your password",
            text: `Password reset link : ${passwordResetCode} ${user._id}`,
        });
        res.send(message);
    });
}
exports.forgotPasswordHandler = forgotPasswordHandler;
function resetPasswordHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, passwordResetCode } = req.params;
        const { password } = req.body;
        const user = yield (0, user_service_1.findUserById)(id);
        if (!user ||
            !user.passwordResetCode ||
            user.passwordResetCode !== passwordResetCode) {
            return next(new http_error_1.default("Could not reset the password", 400));
        }
        user.passwordResetCode = null;
        user.password = password;
        yield user.save();
        res.send("Successfully updated the password");
    });
}
exports.resetPasswordHandler = resetPasswordHandler;
function findAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield (0, user_service_1.getUsers)();
        if (!users || (users === null || users === void 0 ? void 0 : users.length) < 1) {
            return next(new http_error_1.default("No user is available", 404));
        }
        res.json(users);
    });
}
exports.findAllUsers = findAllUsers;
function findUserByIdHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const user = yield (0, user_service_1.findUserById)(id);
        if (!user) {
            return next(new http_error_1.default("User not found", 404));
        }
        res.json(user);
    });
}
exports.findUserByIdHandler = findUserByIdHandler;
