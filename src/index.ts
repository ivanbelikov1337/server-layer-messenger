import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db";
import {userRouter} from "./routes/userRoutes";
import cors  from 'cors'
import {chatRoutes} from "./routes/chatRoutes";
import {messageRoutes} from "./routes/messageRoutes";
import path from "path";



dotenv.config();

const app: Express = express();

const port = process.env.PORT || 5000;

connectDB()

app.use(express.json())
app.use(cors())

app.use("/api/user",userRouter)
app.use("/api/chat",chatRoutes)
app.use("/api/message", messageRoutes);



const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 10000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket: any) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData: any) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room: any) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room: any) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room: any) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved: any) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user: any) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", (userData:any) => {
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    });
})

app.get("/", (req: Request, res: Response) => {
    res.send("good by world")
})

