import bcrypt from "bcryptjs";

import mongoose from "mongoose";


const {Schema} = mongoose

const userSchema = new Schema(
    {
        name: {
            type: "String",
            required: true
        },
        email: {
            type: "String",
            unique: true,
            required: true
        },
        password: {
            type: "String",
            required: true
        },
        pic: {
            type: "String",
            required: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.models.User || mongoose.model("User", userSchema);