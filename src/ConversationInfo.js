const ConversationInfo = ({ options }) => {
  return (
    <div className="mx-8 my-4 px-4 py-4 bg-gray-100 rounded-xl flex items-center">
      <p className="text-base flex-grow">
        <span className="font-bold">Scenario:</span> {options.scenario}
      </p>
      <p>
        <span className="font-bold mb-0.5">Practicing:</span> {options.language}
      </p>
    </div>
  );
};

export default ConversationInfo;
