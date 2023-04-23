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

async function getAudioFromServer(text, language) {
  const data = {
    text: text,
    language: language,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioURL = URL.createObjectURL(audioBlob);
      return audioURL;
    } else {
      console.error("Error in sending the request:", response.statusText);
    }
  } catch (error) {
    console.error("Error in sending the request:", error);
  }
}

const ConversationPage = ({ options, onReturn }) => {
  const [messages, setMessages] = useState([]);
  const [speaker, setSpeaker] = useState("user");

  const updateAudio = async (audioBlob) => {
    setMessages([
      ...messages,
      {
        speaker: "User",
        audio: URL.createObjectURL(audioBlob),
        text: "There is no text",
      },
    ]);
    setSpeaker("bot");

    // Convert blob audio to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = function () {
      const base64 = reader.result.split(",")[1];
      console.log(base64);
      const responseData = sendAudioToServer(base64, options.languageCode);
      responseData.then((data) => {
        console.log("transcript");
        console.log(data.transcript);
        getAudioFromServer(data.transcript, options.languageCode).then(
          (audioURL) => {
            setMessages((prev) => [
              ...prev,
              { speaker: "Bot", text: data.transcript, audio: audioURL },
            ]);
            setSpeaker("user");
          }
        );
      });
    };

    console.log(audioBlob);
  };

  const addBotMessage = (message) => {
    setMessages([...messages]);
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

      <div className="flex flex-col items-center">
        <ConversationHistory messages={messages} />

        <div className="bg-gray-100 p-4 w-96 flex flex-col items-center rounded-xl">
          {speaker === "user" ? (
            <>
              <h1 className="mb-4 text-xl font-bold">
                It's your turn to speak.
              </h1>
              <AudioRecorder updateAudio={updateAudio} />
            </>
          ) : (
            <h1 className="mb-4 text-xl font-bold">Waiting for bot...</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
