import { useEffect, useRef } from "react";
import createOffer from "../utils/createOffer";
import getStreamDataAndSend from "../utils/getStreamDataAndSend";
import creatAnswer from "../utils/createAnswer";
import recievingData from "../utils/recievingData";

export const Sender = () => {
	const userVideo = useRef<HTMLVideoElement>(null);
	const callerVideo = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const socketLocal = new WebSocket("ws://localhost:8080");
		socketLocal.onopen = () => {
			socketLocal.send(
				JSON.stringify({
					type: "sender",
				})
			);
		};

		start(socketLocal);

		() => {
			socketLocal.close();
		};
	}, []);

	function start(socket: WebSocket | null) {
		if (socket) {
			socket.onmessage = (event) => {
				const message = JSON.parse(event.data);
				if (message.type === "start") {
					const pc = new RTCPeerConnection();
					const pc2 = new RTCPeerConnection();
					intiateConn(pc, pc2, socket);
				}
			};
		}
	}

	async function intiateConn(
		pc: RTCPeerConnection,
		pc2: RTCPeerConnection,
		socket: WebSocket
	) {
		if (!socket) {
			alert("Socket not found");
			return;
		}

		//creating offer
		pc.onnegotiationneeded = async () => {
			await createOffer(pc, socket);
		};

		//tranferring ice candidates
		pc.onicecandidate = (event) => {
			if (event.candidate) {
				socket?.send(
					JSON.stringify({
						type: "iceCandidate",
						candidate: event.candidate,
					})
				);
			}
		};

		//taking the answer from the receiver
		socket.onmessage = async (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "createAnswer") {
				//setting answer to the peer connection
				await pc.setRemoteDescription(message.sdp);
			} else if (message.type === "iceCandidate") {
				//adding ice candidate
				pc2.addIceCandidate(message.candidate);
			} else if (message.type === "createOffer") {
				//creating answer
				await pc2.setRemoteDescription(message.sdp);
				await creatAnswer(pc2, socket);
			}
		};

		//getting stream and sending it to the receiver
		getStreamDataAndSend(pc, userVideo);

		//receiving stream from the receiver
		recievingData(pc2, callerVideo);
	}

	return (
		<div>
			Caller page
			<div className="video-container">
				<video ref={userVideo} className="user-video" muted></video>
				<video ref={callerVideo} className="caller-video"></video>
			</div>
		</div>
	);
};
