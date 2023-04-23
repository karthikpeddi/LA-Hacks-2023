import { useState } from "react";
import EntryPage from "./EntryPage";
import ConversationPage from "./ConversationPage";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./App.css";
import "./AppStyles.css";

function App() {
  const [currentPage, setCurrentPage] = useState("entry");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [imageVisible, setImageVisible] = useState(true);

  const handleOptionsSelect = (options) => {
    setSelectedOptions(options);
    setCurrentPage("conversation");
    setImageVisible(false);
  };

  const handleReturn = () => {
    setCurrentPage("entry");

    // Reset Chatgpt context
    try {
      fetch("http://127.0.0.1:5000/clear", {
        method: "POST",
      }).then((response) => {
        if (response.ok) {
          console.log("Cleared conversation context successfully");
        } else {
          console.error("Error in sending the request", response.statusText);
        }
      });
    } catch (error) {
      console.error("Ending in sending request:", error);
    }
    setImageVisible(true);
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
            <EntryPage
              onOptionSelect={handleOptionsSelect}
              imageVisible={imageVisible}
            />
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
