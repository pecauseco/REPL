import { useState } from "react";
import React from "react";
import { Load } from "../functions/load";
import { View } from "../functions/view";
import { Search } from "../functions/search";
//ayman
import { REPLFunction } from "../interfaces/REPLFunction";
//
/**
 * This class represents the input box component
 */

/**
 * This interface represents the Input box props being passed into
 * the input box. They include the history, the isVerbose boolean, and the textbox
 * text
 */
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

/**
 * This allows us to register new functions that our REPL can use in a 
 * hash map
 */
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

/**
 * This allows us to deregister functions that our REPL is currently
 * using
 */
export function unregisterCommand(
  command: string,
) {
  registeredFunctions.delete(command);
}
//
//hmasamur
/**
 * This method initializes the function map by mapping text inputs to 
 * different function files
 */
function initFuncMap() {
  registerCommand("load_file", Load);
  registerCommand("view", View);
  registerCommand("search", Search);
}
//
/**
 * This function is the InputBox function that takes in the props and handles
 * the logic for commands
 */
export default function InputBox(props: InputBoxProps) {
  initFuncMap();
  const [textbox, setTextbox] = useState("");
  let splitInput: string[];

  /**
   * This function checks to see if the function that was called is in the
   * textbox is actually a registered function and if it is, it will
   * return with the promise representing the reponse
   * param - Function or undefined replFunc - the function we are taking in
   * returns a Promise representing the output
   */
  async function getResponse(replFunc: Function | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
      if (replFunc == undefined) {
        reject("Invalid command!");
      } else {
        resolve(replFunc(splitInput));
      }
    });
  }

  /**
   * This method handles the mode switching and will change the isVerbose
   * variable depending on if it is brief or verbose
   */
  function handleMode() {
    props.setIsVerbose(!props.isVerbose);
    if (props.isVerbose) {
      props.setHistory(["mode is now in brief", ...props.history]);
    } else {
      props.setHistory(["mode is now in verbose", ...props.history]);
    }
  }

  /**
   * This method additionally handles mode but utlizes the down arrow to do
   * so as a keyboard shortcut
   */
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

  /**
   * The HTML and Javascript that are the input box
   */
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
          } else if (e.keyCode === 40) {
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


