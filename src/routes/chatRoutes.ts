import {protect} from "../middleware/authMiddleware";

import express from "express";
import {
    accessChat,
    addToGroup,
    createGroupChat,
    fetchChats,
    removeFromGroup,
    renameGroup
} from "../controllers/chatControllers";



export const chatRoutes = express.Router();

chatRoutes.route("/").post(protect, accessChat);
chatRoutes.route("/").get(protect, fetchChats);
chatRoutes.route("/group").post(protect, createGroupChat);
chatRoutes.route("/rename").put(protect, renameGroup);
chatRoutes.route("/groupremove").put(protect, removeFromGroup);
chatRoutes.route("/groupadd").put(protect, addToGroup);

