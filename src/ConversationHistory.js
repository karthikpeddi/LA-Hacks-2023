import "./ConversationHistory.css";

const ConversationHistory = ({ messages, transcripts, textVisible }) => {
  return (
    <div className="flex flex-col items-center flex-grow mx-8 p-4">
      {messages.map((message, index) => {
        return (
          <div
            className="flex items-center gap-x-4 text-sm single-message"
            key={`message:${index}`}
          >
            <div
              className="mb-4 flex items-center gap-x-2"
              key={`message:${index}`}
            >
              <span className="font-bold">
                {message.speaker === "User" ? "You" : "Sakhi"}:
              </span>
              <audio className="block" src={message.audio} controls></audio>
            </div>
            {textVisible ? (
              <h1 className="font-normal mb-4">
                <span className="font-bold">
                  {message.speaker === "User" ? "You" : "Sakhi"}:
                </span>{" "}
                {transcripts[index]}
              </h1>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationHistory;
