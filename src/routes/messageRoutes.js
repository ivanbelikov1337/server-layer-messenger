"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_1 = __importDefault(require("express"));
const messageControllers_1 = require("../controllers/messageControllers");
exports.messageRoutes = express_1.default.Router();
exports.messageRoutes.route("/:chatId").get(authMiddleware_1.protect, messageControllers_1.allMessages);
exports.messageRoutes.route("/").post(authMiddleware_1.protect, messageControllers_1.sendMessage);
