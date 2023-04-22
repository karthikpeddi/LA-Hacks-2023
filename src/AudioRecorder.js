// AudioRecorder.js
import { useState, useRef, useEffect } from "react";
import { WaveSurfer } from "wavesurfer-react";

const AudioRecorder = ({ updateAudio }) => {
  const mimeType = "audio/webm";

  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const mediaRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  const getMicrophonePermission = async () => {
    const streamData = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setPermission(true);
    setStream(streamData);
  };

  const startRecording = async () => {
    setIsRecording(true);
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
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
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      updateAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  return (
    <div>
      {!permission && (
        <button
          onClick={getMicrophonePermission}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Get Microphone
        </button>
      )}
      {permission && !isRecording && (
        <button
          onClick={startRecording}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Record
        </button>
      )}
      {permission && isRecording && (
        <>
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
