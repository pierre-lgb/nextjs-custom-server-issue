const express = require("express")
const { createServer } = require("http")
const ws = require("ws")

const app = express()

const server = createServer(app)

const wss = new ws.Server({ noServer: true })

wss.on("connection", (socket) => {
    console.log("incoming connection")
    socket.onclose = () => {
        console.log("connection closed", wss.clients.size)
    }
})

server.on("upgrade", (req, socket, head) => {
    if (
        req.url?.startsWith(
            process.env.NEXT_PUBLIC_COLLABORATION_PATHNAME || "/collaboration"
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
    const port = 3001
    server.listen(port)
    console.log("Server listening on port", port)
} catch (error) {
    console.log(error)
}
