import { RefObject } from "react";

const recievingData = (
	pc: RTCPeerConnection,
	video: RefObject<HTMLVideoElement>
) => {
	pc.ontrack = (event) => {
		if (video.current === null) {
			return;
		}

		if (!video.current.srcObject) {
			video.current.srcObject = new MediaStream();
		}

		const mediaStream = video.current.srcObject as MediaStream;
		mediaStream.addTrack(event.track);
		video.current.play();
	};
};

export default recievingData;
