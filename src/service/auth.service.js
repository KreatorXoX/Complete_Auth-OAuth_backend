"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
function registerUser(input) {
    return user_model_1.default.create(input);
}
exports.registerUser = registerUser;
function loginUser(email) {
    return user_model_1.default.findOne({ email: email }).exec();
}
exports.loginUser = loginUser;
