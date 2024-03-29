"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const userRoutes_1 = require("./routes/userRoutes");
const cors_1 = __importDefault(require("cors"));
const chatRoutes_1 = require("./routes/chatRoutes");
const messageRoutes_1 = require("./routes/messageRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
(0, db_1.connectDB)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/user", userRoutes_1.userRouter);
app.use("/api/chat", chatRoutes_1.chatRoutes);
app.use("/api/message", messageRoutes_1.messageRoutes);
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
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users)
            return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id)
                return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
app.get("/", (req, res) => {
    res.send("good by world");
});
