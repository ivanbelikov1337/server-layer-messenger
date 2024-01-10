import jwt from "jsonwebtoken";

import User from "../models/userModel"


import asyncHandler from "express-async-handler";


interface IDecode {
    id: string
}
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];


            const decoded =  jwt.verify(token, process.env.JWT_SECRET!) as IDecode;

            req.body.user = await User.findById(decoded.id)

            next();
        } catch (error:any) {
            res.status(401);
            throw new Error(error);
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

