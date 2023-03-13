import { useState } from "react";
import React from 'react';

interface InputBoxProps {
  history: string[];
  setHistory: (data: string[]) => void;
}

export interface loadResponse{
  result: string,
  filepath: string
}

export interface searchResponse {
  result: string;
  search_result: string[];
}


export default function InputBox(props: InputBoxProps) {

  
  // TODO: Add a state variable for the textbox contents
  const [textbox, setTextbox] = useState("");
  let splitInput: string[];


  
  async function loadFile(){
    const response: Response = await fetch("http://localhost:3233/loadcsv?filepath=" + splitInput[1] + "&hasheaders=" + splitInput[2]);
    const responseJson: loadResponse = await response.json();
    const result = responseJson.result
    const filepath = responseJson.filepath
    props.setHistory([...props.history, "result: " + result + ", filepath: " + filepath]);

  }

  async function search(){
    if(splitInput.length == 3){
      splitInput[2]
    }
    const response: Response = await fetch("http://localhost:3233/searchcsv?value=" + splitInput[1] + "");
    const responseJson: searchResponse = await response.json();
    const result = responseJson.result;
    const searchResult = responseJson.search_result;
    props.setHistory([
      ...props.history,
      "result: " + result + ", filepath: " + searchResult,
    ]);

  }
  
  /**
   * Handles the submit button being clicked or the enter key being pressed!
   * You may want to make this function more sophisticated to add real
   * command logic, but for now it just adds the text to the history box.
   */
  function handleSubmit() {
    // TODO: Add the text from the textbox to the history
    // Hint: You can use the spread operator (...) to add to an array
    // TODO: Clear the textbox
    console.log("current contents " + textbox);
    props.setHistory([...props.history, textbox]);
    //...props.history means everything that is in props.history, just adding textbox to the end
    splitInput = textbox.split(" ");
    switch(splitInput[0]){
      case "mode":
        // handleMode();
        break;
      case "load_file":
        loadFile();
        break;
      case "view":
        // view();
        break;
      case "search":
        search();
        break;
      default:
        // notACommand();
        break;
    }

    

    
    setTextbox("")
    console.log(props.history);
  }

  return (
    <div className="repl-input">
      {/* TODO: Make this input box sync with the state variable */}
      <input
        type="text"
        className="repl-command-box"
        onChange={(e) => setTextbox(e.target.value)}
        value={textbox}
      />
      {/* TODO: Make this button call handleSubmit when clicked */}

      <button className="repl-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
