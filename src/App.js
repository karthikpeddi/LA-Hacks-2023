import { useState } from "react";
import EntryPage from "./EntryPage";
import ConversationPage from "./ConversationPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("entry");
  const [selectedOptions, setSelectedOptions] = useState({
    language: "US",
    scenario: "Waiter",
  });

  const handleOptionsSelect = (options) => {
    setSelectedOptions(options);
    setCurrentPage("conversation");
  };

  const handleReturn = () => {
    setCurrentPage("entry");
  };

  return (
    <>
      {currentPage === "entry" && (
        <EntryPage onOptionSelect={handleOptionsSelect} />
      )}
      {currentPage === "conversation" && (
        <ConversationPage options={selectedOptions} onReturn={handleReturn} />
      )}
    </>
  );
}

export default App;
