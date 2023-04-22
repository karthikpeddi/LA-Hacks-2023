import AudioRecorder from "./AudioRecorder";
import ConversationInfo from "./ConversationInfo";
import ConversationHistory from "./ConversationHistory";
//import { get, post } from "axios";
import { useState } from "react";

const ConversationPage = ({ options, onReturn }) => {
  const [messages, setMessages] = useState([]);

  const updateAudio = async (audioBlob) => {
    setMessages([...messages, URL.createObjectURL(audioBlob)]);

    // Convert blob audio to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = function () {
      const base64 = reader.result.split(",")[1];
    };

    //post("http://127.0.0.1:5000/audio-to-text");
    console.log(audioBlob);
  };

  const downloadConversation = () => {
    console.log("Downloaded conversation");
  };

  return (
    <div className="h-screen flex flex-col">
      <ConversationInfo
        options={options}
        restartConversation={onReturn}
        downloadConversation={downloadConversation}
      />

      <ConversationHistory messages={messages} />

      <div className="bg-gray-100 h-1/6 p-4 flex flex-col items-center justify-center">
        <AudioRecorder updateAudio={updateAudio} />
      </div>
    </div>
  );
};

export default ConversationPage;
