import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import { Server } from "socket.io"
import { createServer } from "http" // CORE MODULE
import { newConnectionHandler } from "./socket/index"

const expressServer = express()
const port = process.env.PORT || 3001

// **************************** SOCKET.IO **************************
const httpServer = createServer(expressServer)
const socketioServer = new Server(httpServer) // this constructor expects to receive an HTTP-SERVER as parameter (NOT AN EXPRESS SERVER!!!!!)

socketioServer.on("connection", newConnectionHandler)

// *************************** MIDDLEWARES *************************

// *************************** ENDPOINTS ***************************

// ************************* ERROR HANDLERS ************************
mongoose.connect(process.env.MONGO_URL as string)

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    // DO NOT FORGET TO LISTEN WITH HTTP SERVER HERE, NOT EXPRESS SERVER!
    console.table(listEndpoints(expressServer))
    console.log(`Server listening on port ${port}`)
  })
})
