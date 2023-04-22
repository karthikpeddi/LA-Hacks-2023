import AudioRecorder from "./AudioRecorder";
import { useState } from "react";

const ConversationPage = ({ options }) => {
  const [messages, setMessages] = useState([]);
  const updateAudio = (audio) => {
    setMessages([...messages, audio]);
    console.log(audio);
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-200 p-4">
        <h1 className="text-xl font-bold mb-2">Language: {options.language}</h1>
        <h2 className="text-lg">Scenario: {options.scenario}</h2>
      </div>
      <div className="flex-grow bg-white overflow-auto p-4">
        {/* Your mock conversation components go here */}
        <div className="mb-4">
          <span className="font-bold">User:</span> Hello, how are you?
        </div>
        <div className="mb-4">
          <span className="font-bold">Bot:</span> I'm doing well, thank you! How
          can I help you today?
        </div>
        <div className="mb-4">
          <span className="font-bold">Bot:</span> I'm doing well, thank you! How
          can I help you today?
        </div>
        {/* Add more mock conversation messages here */}
        {messages.map((message) => {
          return (
            <div className="mb-4 flex items-center gap-x-2">
              <span className="font-bold">User:</span>
              <audio src={message} controls></audio>
            </div>
          );
        })}
      </div>
      <div className="bg-gray-100 h-1/4 p-4">
        <AudioRecorder updateAudio={updateAudio} />
      </div>
    </div>
  );
};

export default ConversationPage;
