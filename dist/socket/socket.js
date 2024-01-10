"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSocket = void 0;
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
class ServerSocket {
    constructor(server) {
        this.StartListeners = (socket) => {
            console.info('Message received from ' + socket.id);
            socket.on('handshake', (callback) => {
                console.info('Handshake received from: ' + socket.id);
                const reconnected = Object.values(this.users).includes(socket.id);
                if (reconnected) {
                    console.info('This user has reconnected.');
                    const uid = this.GetUidFromSocketID(socket.id);
                    const users = Object.values(this.users);
                    if (uid) {
                        console.info('Sending callback for reconnect ...');
                        callback(uid, users);
                        return;
                    }
                }
                const uid = (0, uuid_1.v4)();
                this.users[uid] = socket.id;
                const users = Object.values(this.users);
                console.info('Sending callback ...');
                callback(uid, users);
                this.SendMessage('user_connected', users.filter((id) => id !== socket.id), users);
            });
            socket.on('disconnect', () => {
                console.info('Disconnect received from: ' + socket.id);
                const uid = this.GetUidFromSocketID(socket.id);
                if (uid) {
                    delete this.users[uid];
                    const users = Object.values(this.users);
                    this.SendMessage('user_disconnected', users, socket.id);
                }
            });
        };
        this.GetUidFromSocketID = (id) => {
            return Object.keys(this.users).find((uid) => this.users[uid] === id);
        };
        this.SendMessage = (name, users, payload) => {
            console.info('Emitting event: ' + name + ' to', users);
            users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
        };
        ServerSocket.instance = this;
        this.users = {};
        this.io = new socket_io_1.Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });
        this.io.on('connect', this.StartListeners);
    }
}
exports.ServerSocket = ServerSocket;
