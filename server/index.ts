import express, { Application, Request, Response } from "express"
import { createServer } from "http"
import next from "next"
import url from "url"
import WebSocket from "ws"

const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
    const app: Application = express()

    app.all("*", function handler(req: Request, res: Response) {
        const parsedUrl = url.parse(req.url, true)
        nextHandler(req, res, parsedUrl)
    })

    const server = createServer(app)

    // The env variables need to be loaded before
    // TODO
    // import("./collaboration/index").then(({ initCollaboration }) =>
    //     initCollaboration(server)
    // )

    const wss = new WebSocket.Server({ noServer: true })

    wss.on("connection", (socket) => {
        console.log("incoming connection")
        socket.onclose = () => {
            console.log("connection closed", wss.clients.size)
        }
    })

    server.on("upgrade", (req, socket, head) => {
        if (
            req.url?.startsWith(
                process.env.NEXT_PUBLIC_COLLABORATION_PATHNAME ||
                    "/collaboration"
            )
        ) {
            const documentName = req.url.split("/").pop()
            if (documentName) {
                console.log(`Upgrading connection (document: ${documentName})`)
            }

            return
        }

        if (req.url === "/_next/webpack-hmr") {
            return
        }

        socket.end(`HTTP/1.1 400 Bad Request\r\n`)
    })

    try {
        const port = parseInt(process.env.PORT || "3000", 10)
        server.listen(port)
        console.log("Server listening on port", port)
    } catch (error) {
        console.log(error)
    }
})
