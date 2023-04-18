"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
function signJwt(object, keyName, options) {
    const signingKey = config_1.default.get(keyName);
    return jsonwebtoken_1.default.sign(object, signingKey, Object.assign({}, (options && options)));
}
exports.signJwt = signJwt;
function verifyJwt(token, keyName) {
    const verifyKey = config_1.default.get(keyName);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, verifyKey);
        return decoded;
    }
    catch (e) {
        return null;
    }
}
exports.verifyJwt = verifyJwt;
