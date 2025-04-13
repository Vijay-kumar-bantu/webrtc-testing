import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server started on ws://localhost:8080");

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", function connection(ws) {
	ws.on("error", console.error);

	ws.on("close", () => {
		if (ws === senderSocket) {
			senderSocket = null;
		} else if (ws === receiverSocket) {
			receiverSocket = null;
		}
	});

	if (senderSocket) {
		receiverSocket = ws;
		ws.send(JSON.stringify({ type: "start" }));
		senderSocket.send(JSON.stringify({ type: "start" }));
	} else {
		senderSocket = ws;
	}

	ws.on("message", function message(data: any) {
		const message = JSON.parse(data);

		if (message.type === "createOffer") {
			if (ws !== senderSocket) {
				senderSocket?.send(
					JSON.stringify({ type: "createOffer", sdp: message.sdp })
				);
			} else {
				receiverSocket?.send(
					JSON.stringify({ type: "createOffer", sdp: message.sdp })
				);
			}
		} else if (message.type === "createAnswer") {
			if (ws !== receiverSocket) {
				receiverSocket?.send(
					JSON.stringify({ type: "createAnswer", sdp: message.sdp })
				);
			} else {
				senderSocket?.send(
					JSON.stringify({ type: "createAnswer", sdp: message.sdp })
				);
			}
		} else if (message.type === "iceCandidate") {
			if (ws === senderSocket) {
				receiverSocket?.send(
					JSON.stringify({
						type: "iceCandidate",
						peer: message.peer,
						candidate: message.candidate,
					})
				);
			} else if (ws === receiverSocket) {
				senderSocket?.send(
					JSON.stringify({
						type: "iceCandidate",
						candidate: message.candidate,
					})
				);
			}
		}
	});
});
