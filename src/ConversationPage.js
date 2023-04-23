import AudioRecorder from "./AudioRecorder";
import ConversationInfo from "./ConversationInfo";
import ConversationHistory from "./ConversationHistory";
import { useEffect, useState } from "react";

const b64toBlob = async (base64, type = "audio/mpeg") => {
  const res = await fetch(`data:${type};base64,${base64}`);
  return res.blob();
};

const setupConversation = async (speaker, background, languageCode, speed) => {
  const data = {
    speaker: speaker,
    background: background,
    language: languageCode,
    speed: speed,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const jsonData = await response.json();
      const audioBlob = await b64toBlob(jsonData.audio);
      const audioURL = URL.createObjectURL(audioBlob);
      return {
        audioURL: audioURL,
        transcript: jsonData.botTranscript,
      };
    } else {
      console.error("Error in sending the request", response.statusText);
    }
  } catch (error) {
    console.error("Ending in sending request:", error);
  }
};

const converseWithServer = async (base64, languageCode, speed) => {
  const data = {
    audio: base64,
    language: languageCode,
    speed: speed,
  };

  // Send the POST request to the Flask server as a webm base64
  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const jsonData = await response.json();
      const audioBlob = await b64toBlob(jsonData.audio);
      const audioURL = URL.createObjectURL(audioBlob);
      console.log(jsonData.botTranscript);
      console.log(jsonData.userTranscript);
      return {
        audioURL: audioURL,
        botTranscript: jsonData.botTranscript,
        userTranscript: jsonData.userTranscript,
      };
    } else {
      console.error("Error in sending the request:", response.statusText);
    }
  } catch (error) {
    console.error("Error in sending the request:", error);
  }
};

const ConversationPage = ({ options, onReturn }) => {
  const [messages, setMessages] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [speaker, setSpeaker] = useState("bot");
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (options.speaker && options.languageCode) {
      setupConversation(
        options.speaker,
        options.background,
        options.languageCode,
        options.speed
      ).then(({ audioURL, transcript }) => {
        setMessages([{ speaker: "Bot", audio: audioURL }]);
        setTranscripts([transcript]);
        setSpeaker("user");
      });
    }
  }, []);

  useEffect(() => {
    console.log("component mounted");
  }, []);

  const toggleTextVisible = () => {
    setTextVisible(!textVisible);
  };

  const updateAudio = async (audioBlob) => {
    setMessages((prev) => [
      ...prev,
      {
        speaker: "User",
        audio: URL.createObjectURL(audioBlob),
      },
    ]);
    setTranscripts((prev) => [...prev, "Waiting to transcribe user text..."]);

    setSpeaker("bot");

    // Convert blob audio to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = function () {
      const base64 = reader.result.split(",")[1];
      converseWithServer(base64, options.languageCode, options.speed).then(
        ({ audioURL, botTranscript, userTranscript }) => {
          setMessages((prev) => [...prev, { speaker: "Bot", audio: audioURL }]);
          setTranscripts((prev) => [
            ...prev.slice(0, -1),
            userTranscript,
            botTranscript,
          ]);
          setSpeaker("user");
        }
      );
    };
  };

  return (
    <div className="h-screen flex flex-col">
      <ConversationInfo
        options={options}
        restartConversation={onReturn}
        toggleTextVisible={toggleTextVisible}
        textVisible={textVisible}
      />

      <div className="flex flex-col items-center">
        <ConversationHistory
          messages={messages}
          transcripts={transcripts}
          textVisible={textVisible}
        />

        <div className="bg-gray-100 p-4 w-96 flex flex-col items-center rounded-xl shadow-md">
          {speaker === "user" ? (
            <>
              <h1 className="mb-4 text-xl font-bold">Your turn!</h1>
              <AudioRecorder updateAudio={updateAudio} />
            </>
          ) : (
            <h1 className="text-xl font-bold">Waiting for bot...</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
