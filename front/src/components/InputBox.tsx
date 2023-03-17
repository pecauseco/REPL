import { useState } from "react";
import React from "react";
import { Load } from "../functions/load";
import { View } from "../functions/view";
import { Search } from "../functions/search";
//ayman
import { REPLFunction } from "../interfaces/REPLFunction";
//

interface InputBoxProps {
  history: string[];
  setHistory: (data: string[]) => void;
  isVerbose: boolean;
  setIsVerbose: (data: boolean) => void;
  //
  textboxArray: string[];
  setTextboxArray: (data: string[]) => void;
  //
}


//adapted from abenjell-rdong14

let registeredFunctions: Map<string, REPLFunction> = new Map<
  string,
  REPLFunction
>();
export function registerCommand(
  command: string,
  commandFunction: REPLFunction
) {
  registeredFunctions.set(command, commandFunction);
}
//
//hmasamur
function initFuncMap() {
  registerCommand("load_file", Load);
  registerCommand("view", View);
  registerCommand("search", Search);
}
//
export default function InputBox(props: InputBoxProps) {
  initFuncMap();
  const [textbox, setTextbox] = useState("");
  let splitInput: string[];

  

  async function getResponse(replFunc: Function | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
      if (replFunc == undefined) {
        reject("Invalid command!");
      } else {
        resolve(replFunc(splitInput));
      }
    });
  }

  function handleMode() {
    props.setIsVerbose(!props.isVerbose);
    if (props.isVerbose) {
      props.setHistory(["mode is now in brief", ...props.history]);
    } else {
      props.setHistory(["mode is now in verbose", ...props.history]);
    }
  }

  function handleModeArrow() {
     props.setTextboxArray([...props.textboxArray, "mode through arrow"]);
    props.setIsVerbose(!props.isVerbose);
    if (props.isVerbose) {
      props.setHistory(["mode is now in brief", ...props.history]);
    } else {
      props.setHistory(["mode is now in verbose", ...props.history]);
    }
  }

  /**
   * Handles the submit button being clicked or the enter key being pressed!
   * You may want to make this function more sophisticated to add real
   * command logic, but for now it just adds the text to the history box.
   */
  function handleSubmit() {
    props.setTextboxArray([...props.textboxArray, textbox]);
    splitInput = textbox.split(" ");
    switch (splitInput[0]) {
      case "mode":
        handleMode();
        break;
      default:
        if (registeredFunctions.has(splitInput[0])) {
          let replFunc = registeredFunctions.get(splitInput[0]);
          getResponse(replFunc).then((response) => {
            props.setHistory([response, ...props.history]);
          });
        } else {
          props.setHistory(["Please enter a valid command", ...props.history]);
        }
        break;

    }

    setTextbox("");
    console.log(props.history);
  }

  return (
    <div
      aria-label="Input area"
      aria-describedby="This is the input area"
      className="repl-input"
     
    >
      <input
        data-testid="input-box"
        type="text"
        className="repl-command-box"
        aria-label="Input Box"
        aria-describedby="This is the input box. Write your commands here"
        onChange={(e) => setTextbox(e.target.value)}
        value={textbox}
        onKeyUp={(e) => {
          if (e.key == "Enter") {
            handleSubmit();
          }
          else if(e.keyCode === 40){
            handleModeArrow();
          }
        }}
        
      />

      <button
        className="repl-button"
        data-testid="button"
        aria-label="Submit Button"
        aria-describedby="This is the submit button. After you write your commands submit by pressing the button"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}


