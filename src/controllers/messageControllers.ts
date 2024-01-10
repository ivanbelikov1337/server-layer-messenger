import asyncHandler from "express-async-handler";
import Message from "../models/messageModel";
import User from "../models/userModel";
import Chat from "../models/chatModels";

export const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error:any) {
        res.status(400);
        throw new Error(error.message);
    }
});



export const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        res.sendStatus(400);
    }

    let newMessage = {
        sender: req.body.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.json(message);
    } catch (error: any) {
        res.status(400);
        throw new Error(error.message);
    }
});
