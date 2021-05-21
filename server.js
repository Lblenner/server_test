import { Server } from "socket.io"

const server = new Server()

server.on("connection", socket => {
	console.log("Connection !")

	socket.on("message", (msg) => {
		console.log(`New message : ${msg}`)
	})

	socket.on("monTag", (msg) => {
		console.log(`New Tag : ${msg}`)
	})
});

const PORT = 3000
server.listen(PORT);
console.log(`Server started listening on port ${PORT}`)

