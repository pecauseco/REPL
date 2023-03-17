import { useState } from "react";
import "../styles/App.css";
import Header from "./components/Header";
import HistoryBox from "./components/HistoryBox";
import InputBox from "./components/InputBox";

/**
 * This is the App function that sets up the entire page
 */
function App() {
  // The data state is an array of strings, which is passed to our components
  // You may want to make this a more complex object, but for now it's just a string
  const [history, setHistory] = useState<string[]>([]);
  const [isVerbose, setIsVerbose] = useState(false);
  const [textboxArray, setTextboxArray] = useState<string[]>([]);
  return (
    <div className="wrapper">
      <Header />
      <div className="repl">
        <HistoryBox 
          
          history={history}
          isVerbose={isVerbose}
          textboxArray={textboxArray}
        />

        <hr />
        <InputBox aria-label="This is the input box. Write your commands here"
          history={history}
          setHistory={setHistory}
          isVerbose={isVerbose}
          setIsVerbose={setIsVerbose}
          textboxArray={textboxArray}
          setTextboxArray={setTextboxArray}
          />
        
      </div>
    </div>
  );
}

export default App;
