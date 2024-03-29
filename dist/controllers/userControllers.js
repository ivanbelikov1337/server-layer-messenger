"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = exports.registerUser = exports.allUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = require("../config/generateToken");
const userModel_1 = __importDefault(require("../models/userModel"));
const db_1 = require("../config/db");
exports.allUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = yield userModel_1.default.find(keyword);
    res.send(users);
}));

// exports.upDateUser111 = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
//     const { _id, idAppwrite } = req.body;
//     const user = yield userModel_1.default.findByIdAndUpdate(_id, { idAppwrite: idAppwrite });
//     if (user) {
//         res.send(200).json(idAppwrite);
//     }
//     else {
//         res.status(400);
//         throw new Error("idAppwrite not updated");
//     }
// }));

exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, idAppwrite } = req.body;
    const filter = { _id: _id };
    yield (0, db_1.connectDB)();
    const user = yield userModel_1.default.findOneAndUpdate(filter, { idAppwrite: idAppwrite }, { new: true });
    // yield user.save();
    console.log(user);
    if (user) {
        res.json(user);
    }
}));

exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, pic,idAppwrite} = req.body;
    if (!name || !email || !password || !idAppwrite) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }
    const userExists = yield userModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = yield userModel_1.default.create({
        name,
        email,
        password,
        idAppwrite,
        pic,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            idAppwrite: user.idAppwrite,
            pic: user.pic,
            token: (0, generateToken_1.generateToken)(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("User not found");
    }
}));
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (user && (yield user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            idAppwrite:user.idAppwrite,
            pic: user.pic,
            token: (0, generateToken_1.generateToken)(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
}));
