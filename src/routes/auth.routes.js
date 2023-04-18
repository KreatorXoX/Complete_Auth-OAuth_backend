"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateSchema_1 = __importDefault(require("../middleware/validateSchema"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_schema_1 = require("../schema/auth.schema");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const loginLimiter_1 = __importDefault(require("../middleware/loginLimiter"));
const router = express_1.default.Router();
router.post("/api/auth/register", (0, validateSchema_1.default)(auth_schema_1.registerUserSchema), (0, express_async_handler_1.default)(auth_controller_1.registerUserHandler));
router.post("/api/auth/login", loginLimiter_1.default, (0, validateSchema_1.default)(auth_schema_1.loginUserSchema), (0, express_async_handler_1.default)(auth_controller_1.loginUserHandler));
router.post("/api/auth/logout", (0, express_async_handler_1.default)(auth_controller_1.logoutUserHandler));
router.get("/api/auth/refresh", (0, express_async_handler_1.default)(auth_controller_1.refreshUserHandler));
exports.default = router;
