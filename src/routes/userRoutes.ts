import express from "express";
import {allUsers, authUser, registerUser} from "../controllers/userControllers";
import {protect} from "../middleware/authMiddleware";


export const userRouter = express.Router();



userRouter.route("/").get(protect,allUsers);
userRouter.route("/").post(registerUser)
userRouter.post("/login", authUser);


