"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByMail = exports.findUserById = exports.getUsers = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
function createUser(input) {
    return user_model_1.default.create(input);
}
exports.createUser = createUser;
function getUsers() {
    return user_model_1.default.find();
}
exports.getUsers = getUsers;
function findUserById(id) {
    return user_model_1.default.findById(id).exec();
}
exports.findUserById = findUserById;
function findUserByMail(email) {
    return user_model_1.default.findOne({ email: email }).exec();
}
exports.findUserByMail = findUserByMail;
