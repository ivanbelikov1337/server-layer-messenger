"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_1 = __importDefault(require("express"));
const chatControllers_1 = require("../controllers/chatControllers");
exports.chatRoutes = express_1.default.Router();
exports.chatRoutes.route("/").post(authMiddleware_1.protect, chatControllers_1.accessChat);
exports.chatRoutes.route("/").get(authMiddleware_1.protect, chatControllers_1.fetchChats);
exports.chatRoutes.route("/group").post(authMiddleware_1.protect, chatControllers_1.createGroupChat);
exports.chatRoutes.route("/rename").put(authMiddleware_1.protect, chatControllers_1.renameGroup);
exports.chatRoutes.route("/groupremove").put(authMiddleware_1.protect, chatControllers_1.removeFromGroup);
exports.chatRoutes.route("/groupadd").put(authMiddleware_1.protect, chatControllers_1.addToGroup);
