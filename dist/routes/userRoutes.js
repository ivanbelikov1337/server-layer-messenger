"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.userRouter = express_1.default.Router();
exports.userRouter.route("/").get(authMiddleware_1.protect, userControllers_1.allUsers);
exports.userRouter.route("/").post(userControllers_1.registerUser);
exports.userRouter.put("/update", userControllers_1.updateUser);
exports.userRouter.post("/login", userControllers_1.authUser);
