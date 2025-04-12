import { useEffect, useState } from "react";

export const Receiver = () => {
	const [socket, setSocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8080");
		setSocket(socket);
		socket.onopen = () => {
			socket.send(
				JSON.stringify({
					type: "receiver",
				})
			);
		};
	}, []);

	const start = () => {
		if (socket) {
			startReceiving(socket);
		}
	};

	function startReceiving(socket: WebSocket) {
		const receiver = document.getElementById("receiver") as HTMLVideoElement;
		const video = document.createElement("video");
		receiver.appendChild(video);

		const pc = new RTCPeerConnection();

		pc.ontrack = (event) => {
			video.srcObject = new MediaStream([event.track]);
			video.play();
		};

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "createOffer") {
				console.log("receiver recieving offer");
				pc.setRemoteDescription(message.sdp).then(() => {
					pc.createAnswer().then((answer) => {
						pc.setLocalDescription(answer);
						socket.send(
							JSON.stringify({
								type: "createAnswer",
								sdp: answer,
							})
						);
					});
				});
			} else if (message.type === "iceCandidate") {
				console.log("receiver sending ice candidate");
				pc.addIceCandidate(message.candidate);
			}
		};
	}

	return (
		<>
			<button onClick={start}>Start</button>
			<div id="receiver"></div>
		</>
	);
};
