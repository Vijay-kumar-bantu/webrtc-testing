import { RefObject } from "react";

const getStreamDataAndSend = async (
	pc: RTCPeerConnection,
	video: RefObject<HTMLVideoElement>
) => {
	navigator.mediaDevices
		.getUserMedia({ video: true, audio: true })
		.then((stream) => {
			if (video.current === null) {
				return;
			}
			video.current.srcObject = stream;
			video.current.play();

			console.log("strems", stream.getTracks());

			stream.getTracks().forEach((track) => {
				pc?.addTrack(track);
			});
		});
};

export default getStreamDataAndSend;
