import express from "express"
import { Server } from "socket.io"
import { createServer } from "http" // CORE MODULE
import cors from "cors"
import { newConnectionHandler } from "./socket/index"
import productsRouter from "./api/products"

const expressServer = express()

// **************************** SOCKET.IO **************************
const httpServer = createServer(expressServer)
const socketioServer = new Server(httpServer) // this constructor expects to receive an HTTP-SERVER as parameter (NOT AN EXPRESS SERVER!!!!!)

socketioServer.on("connection", newConnectionHandler)

// *************************** MIDDLEWARES *************************
expressServer.use(cors())
expressServer.use(express.json())

// *************************** ENDPOINTS ***************************
expressServer.use("/products", productsRouter)

// ************************* ERROR HANDLERS ************************

export { httpServer, expressServer }
