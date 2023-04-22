import { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/20/solid";
import { WaveSurfer } from "wavesurfer-react";

const AudioRecorder = ({ updateAudio }) => {
  const mimeType = "audio/webm";

  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const mediaRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  const getMicrophonePermission = async () => {
    const streamData = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setPermission(true);
    setStream(streamData);
  };

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    const media = new MediaRecorder(stream, { type: mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setIsRecording(false);
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      updateAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  return (
    <div>
      {permission && !isRecording && (
        <button
          onClick={startRecording}
          className="bg-red-500 duration-100 hover:bg-red-600 flex items-center text-white font-semibold px-4 py-2 rounded"
        >
          <MicrophoneIcon className="w-5 h-5 mr-2" />
          Record
        </button>
      )}
      {permission && isRecording && (
        <>
          <button
            onClick={stopRecording}
            className="bg-red-600 duration-100 hover:bg-red-700 flex items-center font-semibold text-white px-4 py-2 rounded"
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
