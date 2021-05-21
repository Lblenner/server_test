import { io } from "socket.io-client";

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


const socket_sender = io("http://localhost:3000");
socket_sender.emit("start_stream", "cool_raoul")

const socket1 = io("http://localhost:3000");

socket1.emit("streams")
socket1.on("streams", (streams) => {
	socket1.emit("sub_stream", streams[0].id)
})
socket1.on("video", (img) => {
	console.log(img)
})

console.log("Starting video stream")

while (true) {
	socket_sender.emit("video", "BLAH")
	await sleep(100)
}

