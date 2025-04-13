const createOffer = async (pc: RTCPeerConnection, socket: WebSocket) => {
	const offer = await pc.createOffer();
	await pc.setLocalDescription(offer);
	socket?.send(
		JSON.stringify({
			type: "createOffer",
			sdp: pc.localDescription,
		})
	);
};

export default createOffer;
