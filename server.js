import { Server } from "socket.io"

const DEBUG = true;

let conf = {
	cors: {
		origin: "https://82.65.243.105:3000",
		methods: ["GET", "POST"]
	}
}

const server = new Server(conf)

let streams = {}
let id_cpt = 0;

function log(obj) {
	if (DEBUG) {
		console.log(obj)
	}
}

server.on("connection", socket => {

	log(`Connection of ${socket.id}!`)

	socket.on("start_stream", (title) => {
		log(`${socket.id} starting new stream ${title} with id ${id_cpt}`)
		streams[socket.id] = {
			title: title,
			subs: [],
			id: id_cpt
		}
		id_cpt++
	})

	socket.on("sub_stream", (id_stream) => {
		log(`${socket.id} subbing to stream ${id_stream}`)
		let stream = Object.values(streams).find((stream) => {
			return stream.id === id_stream
		})

		if (stream) {
			stream.subs.push(socket)
		} else {
			socket.emit("error", `Stream with id ${id_stream} not found`)
		}
	})

	socket.on("unsub_stream", (id_stream) => {
		log(`${socket.id} unsubbing from stream ${id_stream}`)
		let stream = Object.values(streams).find((stream) => {
			return stream.id === id_stream
		})

		if (stream) {
			let s = stream.subs.find(s => s.id === socket.id)
			if (s) {
				stream.subs = stream.subs.filter(s => s.id !== socket.id)
			} else {
				socket.emit("error", `Socket was not sub to stream with id ${id_stream}`)
			}
		} else {
			socket.emit("error", `Stream with id ${id_stream} not found`)
		}
	})

	/* send video to all subs */
	socket.on("video", (img) => {
		if (streams[socket.id]) {
			for (let sub of streams[socket.id].subs) {
				sub.emit("video", img)
			}
		} else {
			socket.emit("error", "Stream was not started")
		}
	})

	/* delete associated stream */
	socket.on("disconnect", () => {
		log(`${socket.id} disconnect`)
		if (streams[socket.id]) {
			for (let sub of streams[socket.id].subs) {
				sub.send(`Stream ${streams[socket.id].title} has ended`)
			}
			delete streams[socket.id]
		}
	})

	/* Send back all the streams available */
	socket.on("streams", () => {
		log(`${socket.id} asking for streams`)
		let stream_desc = Object.values(streams).map(stream => { return { title: stream.title, id: stream.id } })
		socket.emit("streams", stream_desc)
	})

});

const PORT = 3000
server.listen(PORT);
console.log(`Server started listening on port ${PORT}`)

