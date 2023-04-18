"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const validateSchema_1 = __importDefault(require("../middleware/validateSchema"));
const user_schema_1 = require("../schema/user.schema");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const verifyJWT_1 = __importDefault(require("../middleware/verifyJWT"));
const verifyAdmin_1 = __importDefault(require("../middleware/verifyAdmin"));
const router = express_1.default.Router();
router.get("/api/users", verifyAdmin_1.default, (0, express_async_handler_1.default)(user_controller_1.findAllUsers));
router.get("/api/user/:id", verifyJWT_1.default, (0, validateSchema_1.default)(user_schema_1.findUserByIdSchema), (0, express_async_handler_1.default)(user_controller_1.findUserByIdHandler));
router.get("/api/users/verify/:id/:verificationCode", (0, validateSchema_1.default)(user_schema_1.verifyUserSchema), (0, express_async_handler_1.default)(user_controller_1.verifyUserHandler));
router.post("/api/users/forgot-password", (0, validateSchema_1.default)(user_schema_1.forgotPasswordSchema), (0, express_async_handler_1.default)(user_controller_1.forgotPasswordHandler));
router.get("/api/users/reset-password/:id/:passwordResetCode", (0, validateSchema_1.default)(user_schema_1.resetPasswordSchema), (0, express_async_handler_1.default)(user_controller_1.resetPasswordHandler));
exports.default = router;
