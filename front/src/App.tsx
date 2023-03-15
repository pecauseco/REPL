import { useState } from "react";
import "../styles/App.css";
import Header from "./components/Header";
import HistoryBox from "./components/HistoryBox";
import InputBox from "./components/InputBox";

function App() {
  // The data state is an array of strings, which is passed to our components
  // You may want to make this a more complex object, but for now it's just a string
  const [history, setHistory] = useState<string[]>([]);
  const [isVerbose, setIsVerbose] = useState(false);
  const [textboxArray, setTextboxArray] = useState<string[]>([]);
  return (
    <div className="wrapper">
      <div className="header">
        <Header />
      </div>
      <div className="repl">
        {/* TODO: Add HistoryBox */}
        <HistoryBox
          history={history}
          isVerbose={isVerbose}
          textboxArray={textboxArray}
        />

        <hr />
        {/* TODO: Add InputBox */}
        <div className="bottomPage">
          <InputBox
            history={history}
            setHistory={setHistory}
            isVerbose={isVerbose}
            setIsVerbose={setIsVerbose}
            textboxArray={textboxArray}
            setTextboxArray={setTextboxArray}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
