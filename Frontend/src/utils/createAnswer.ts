const creatAnswer = async (pc: RTCPeerConnection, socket: WebSocket) => {
	pc.createAnswer().then((answer) => {
		pc.setLocalDescription(answer);
		socket.send(
			JSON.stringify({
				type: "createAnswer",
				sdp: answer,
			})
		);
	});
};

export default creatAnswer;
