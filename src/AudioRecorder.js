import { useState, useRef } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/20/solid";

const AudioRecorder = ({ updateAudio }) => {
  const mimeType = "audio/webm";

  const mediaRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    setIsRecording(true);
    mediaRecorder.current = new MediaRecorder(stream, { type: mimeType });
    mediaRecorder.current.start();

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      // Once data becomes available (recording stops, add it as a message)
      const audioBlob = new Blob([event.data], { type: mimeType });
      updateAudio(audioBlob);
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current.stop();
  };

  return (
    <div>
      {!isRecording && (
        <button
          onClick={startRecording}
          className="bg-red-500 duration-100 hover:bg-red-600 flex items-center text-white font-semibold px-4 py-2 rounded-md"
        >
          <MicrophoneIcon className="w-5 h-5 mr-2" />
          Start Recording
        </button>
      )}
      {isRecording && (
        <>
          <button
            onClick={stopRecording}
            className="bg-red-600 duration-100 hover:bg-red-700 flex items-center font-semibold text-white px-4 py-2 rounded-md"
          >
            <StopIcon className="w-5 h-5 mr-2" />
            Stop
          </button>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
