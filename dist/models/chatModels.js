"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const chatModels = new Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    latestMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });
exports.default = mongoose_1.default.models.Chat || mongoose_1.default.model("Chat", chatModels);
