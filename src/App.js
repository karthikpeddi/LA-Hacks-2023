import { useState } from "react";
import EntryPage from "./EntryPage";
import ConversationPage from "./ConversationPage";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./App.css";
import "./AppStyles.css";

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
    <div className="App">
      <TransitionGroup>
        {currentPage === "entry" && (
          <CSSTransition
            key="entry"
            timeout={300}
            classNames="slide-entry"
            unmountOnExit
          >
            <EntryPage onOptionSelect={handleOptionsSelect} />
          </CSSTransition>
        )}
        {currentPage === "conversation" && (
          <CSSTransition
            key="conversation"
            timeout={300}
            classNames="slide-conversation"
            unmountOnExit
          >
            <ConversationPage
              options={selectedOptions}
              onReturn={handleReturn}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
}

export default App;
