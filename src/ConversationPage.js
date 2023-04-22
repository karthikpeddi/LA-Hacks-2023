import AudioRecorder from "./AudioRecorder";
import ConversationInfo from "./ConversationInfo";
import { useState } from "react";

const ConversationPage = ({ options }) => {
  const [messages, setMessages] = useState([]);
  const updateAudio = (audio) => {
    setMessages([...messages, audio]);
    console.log(audio);
  };
  return (
    <div className="h-screen flex flex-col">
      <ConversationInfo options={options} />

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
