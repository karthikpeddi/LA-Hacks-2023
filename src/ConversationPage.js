import AudioRecorder from "./AudioRecorder";
import ConversationInfo from "./ConversationInfo";
import ConversationHistory from "./ConversationHistory";
import { useEffect, useState } from "react";

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
  const [speaker, setSpeaker] = useState("bot");
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (options.scenario && options.languageCode) {
      getAudioFromServer(options.scenario, options.languageCode).then(
        (audioURL) => {
          setMessages([
            { speaker: "Bot", text: options.scenario, audio: audioURL },
          ]);
          setSpeaker("user");
        }
      );
    }
  }, [options]);

  const toggleTextVisible = () => {
    setTextVisible(!textVisible);
  };

  const updateAudio = async (audioBlob) => {
    setMessages([
      ...messages,
      {
        speaker: "User",
        audio: URL.createObjectURL(audioBlob),
        text: "Waiting to transcribe user text...",
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
        setMessages((prev) => {
          let messages = [...prev];
          messages[messages.length - 1].text = data.transcript;
          return messages;
        });
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

  const downloadConversation = () => {
    console.log("Downloaded conversation");
  };

  return (
    <div className="h-screen flex flex-col">
      <ConversationInfo
        options={options}
        restartConversation={onReturn}
        downloadConversation={downloadConversation}
        toggleTextVisible={toggleTextVisible}
        textVisible={textVisible}
      />

      <div className="flex flex-col items-center">
        <ConversationHistory messages={messages} textVisible={textVisible} />

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
