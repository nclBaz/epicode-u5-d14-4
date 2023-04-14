"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const http_1 = require("http"); // CORE MODULE
const index_1 = require("./socket/index");
const expressServer = (0, express_1.default)();
const port = process.env.PORT || 3001;
// **************************** SOCKET.IO **************************
const httpServer = (0, http_1.createServer)(expressServer);
const socketioServer = new socket_io_1.Server(httpServer); // this constructor expects to receive an HTTP-SERVER as parameter (NOT AN EXPRESS SERVER!!!!!)
socketioServer.on("connection", index_1.newConnectionHandler);
// *************************** MIDDLEWARES *************************
// *************************** ENDPOINTS ***************************
// ************************* ERROR HANDLERS ************************
mongoose_1.default.connect(process.env.MONGO_URL);
mongoose_1.default.connection.on("connected", () => {
    httpServer.listen(port, () => {
        // DO NOT FORGET TO LISTEN WITH HTTP SERVER HERE, NOT EXPRESS SERVER!
        console.table((0, express_list_endpoints_1.default)(expressServer));
        console.log(`Server listening on port ${port}`);
    });
});
