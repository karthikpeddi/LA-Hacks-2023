import AudioRecorder from "./AudioRecorder";
import ConversationInfo from "./ConversationInfo";
import ConversationHistory from "./ConversationHistory";
//import { get, post } from "axios";
import { useState } from "react";

async function sendAudioToServer(base64, language) {
  const data = {
    audio: base64,
    language: language,
  };

  // Send the POST request to the Flask server as a webm base64
  try {
    const response = await fetch("http://127.0.0.1:5000/audio-to-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error in sending the request:", response.statusText);
    }
  } catch (error) {
    console.error("Error in sending the request:", error);
  }
}

const ConversationPage = ({ options, onReturn }) => {
  const [messages, setMessages] = useState([]);

  const updateAudio = async (audioBlob) => {
    setMessages([...messages, URL.createObjectURL(audioBlob)]);

    // Convert blob audio to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = function () {
      const base64 = reader.result.split(",")[1];
      console.log(base64);
      const responseData = sendAudioToServer(base64, options.languageCode);
      console.log(responseData);
    };

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
