import { io } from "socket.io-client";

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

let ip = "82.65.243.105"
let addr = `http://${ip}:3000`

const socket_sender = io(addr);
socket_sender.emit("start_stream", "cool_raoul")

const socket1 = io(addr);

socket1.emit("streams")
socket1.on("streams", (streams) => {
	console.log("Streams available: ", streams)
	if (streams[0]) {
		socket1.emit("sub_stream", streams[0].id)
	}
})
socket1.on("video", (img) => {
	console.log(img)
})

console.log("Starting video stream")

while (true) {
	socket_sender.emit("video", "BLAH")
	await sleep(100)
}

