const ConversationHistory = ({ messages, textVisible }) => {
  return (
    <div className="flex flex-col items-center flex-grow mx-8 p-4">
      {messages.map((message, index) => {
        return (
          <div className="flex items-center gap-x-4">
            <div
              className="mb-4 flex items-center gap-x-2"
              key={`message:${index}`}
            >
              <span className="font-bold">{message.speaker}:</span>
              <audio src={message.audio} controls></audio>
            </div>
            {textVisible ? (
              <h1 className="font-normal text-sm mb-4">
                <span className="font-bold">{message.speaker}:</span>{" "}
                {message.text}
              </h1>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationHistory;
