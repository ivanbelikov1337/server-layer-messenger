import {protect} from "../middleware/authMiddleware";
import express from "express";
import {allMessages, sendMessage} from "../controllers/messageControllers";



export const messageRoutes = express.Router();

messageRoutes.route("/:chatId").get(protect, allMessages);
messageRoutes.route("/").post(protect, sendMessage);

