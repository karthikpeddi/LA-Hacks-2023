const ConversationHistory = ({ messages }) => {
  return (
    <div className="flex flex-col items-center flex-grow mx-8 p-4">
      {messages.map((message, index) => {
        return (
          <div
            className="mb-4 flex items-center gap-x-2"
            key={`message:${index}`}
          >
            <span className="font-bold">{message.speaker}:</span>
            <audio src={message.audio} controls></audio>
            <h1 className="font-bold text-sm">{message.text}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationHistory;
