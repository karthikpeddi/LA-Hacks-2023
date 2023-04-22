import { ArrowPathIcon, ArrowDownTrayIcon } from "@heroicons/react/20/solid";

const ConversationInfo = ({
  options,
  restartConversation,
  downloadConversation,
}) => {
  return (
    <div className="mx-8 my-4 px-4 py-4 bg-gray-100 gap-x-2 rounded-xl flex items-center">
      <p className="text-base flex-grow">
        <span className="font-bold">Scenario:</span> {options.scenario}
      </p>
      <div className="flex items-center mr-2">
        <span className="font-bold mr-2">Practicing:</span>{" "}
        <options.flag className="w-5 h-5 mr-2" />
        <span>{`${options.language}`}</span>
      </div>
      <button
        title="Restart conversation"
        className="p-2 rounded hover:bg-gray-200"
        onClick={restartConversation}
      >
        <ArrowPathIcon className="w-5 h-5" />
      </button>
      <button
        title="Download transcript"
        className="p-2 rounded hover:bg-gray-200"
        onClick={downloadConversation}
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ConversationInfo;
