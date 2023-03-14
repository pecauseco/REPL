import { useState } from "react";
import React from 'react';
import { Load } from "../functions/load";
import { View } from "../functions/view";
import { Search } from "../functions/search";
//ayman
import { REPLFunction } from "../functions/REPLFunction";
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

// export interface loadResponse{
//   result: string,
//   filepath: string
// }

// export interface searchResponse {
//   result: string;
//   search_result: string[];
// }

// export interface viewResponse {
//   result: string;
//   data: string[][];
// }

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
  // TODO: Add a state variable for the textbox contents
  const [textbox, setTextbox] = useState("");
  let splitInput: string[];

  // async function loadFile() {
  //   const response: Response = await fetch(
  //     "http://localhost:3233/loadcsv?filepath=" +
  //       splitInput[1] +
  //       "&hasheaders=" +
  //       splitInput[2]
  //   );
  //   const responseJson: loadResponse = await response.json();
  //   const result = responseJson.result;
  //   const filepath = responseJson.filepath;
  //   props.setHistory([
  //     ...props.history,
  //     "result: " + result + ", filepath: " + filepath,
  //   ]);
  // }

  // async function view() {
  //   const response: Response = await fetch("http://localhost:3233/viewcsv");
  //   const responseJson: viewResponse = await response.json();
  //   const result = responseJson.result;
  //   const data = responseJson.data;
  //   props.setHistory([
  //     ...props.history,
  //     "result: " + result + ", data: " + makeTable(data),
  //   ]);
  // }

  // /**
  //  * Makes a table representing the data from the csv
  //  * @param fileData - the data from the loaded csv file
  //  * @returns a string that is an html representaion of what will be added to the history
  //  * portion of the page
  //  */
  // function makeTable(fileData: Array<Array<string>> | null): string {
  //   if (fileData == null) {
  //     return "Please input a correct 2D array.";
  //   }

  //   // referenced from https://stackoverflow.com/questions/15164655/generate-html-table-from-2d-javascript-array
  //   //also referenced from sprint-2-hmasamur-jwan8
  //   var result = "<table align='center'>";
  //   for (var i = 0; i < fileData.length; i++) {
  //     result += "<tr>";
  //     for (var j = 0; j < fileData[i].length; j++) {
  //       result += "<td>" + fileData[i][j] + "</td>";
  //     }
  //     result += "</tr>";
  //   }
  //   result += "</table>";
  //   return result;
  // }

  // async function search() {
  //   let response: Response;
  //   console.log(splitInput);
  //   if (splitInput.length < 2) {
  //     props.setHistory([
  //       ...props.history,
  //       "result: please provide a search value",
  //     ]);
  //     return;
  //   } else if (splitInput.length == 3) {
  //     const col: string = splitInput[2];
  //     response = await fetch(
  //       "http://localhost:3233/searchcsv?value=" +
  //         splitInput[1] +
  //         "colindex=" +
  //         col
  //     );
  //   } else {
  //     if (splitInput[1] == "") {
  //       props.setHistory([
  //         ...props.history,
  //         "result: please provide a search value",
  //       ]);
  //       return;
  //     }
  //     response = await fetch(
  //       "http://localhost:3233/searchcsv?value=" + splitInput[1]
  //     );
  //   }
  //   const responseJson: searchResponse = await response.json();
  //   console.log(responseJson);
  //   const result = responseJson.result;
  //   const searchResult = responseJson.search_result;
  //   props.setHistory([
  //     ...props.history,
  //     "result: " + result + ", search result: " + searchResult,
  //   ]);
  // }


  async function getResponse(replFunc: Function | undefined) : Promise<string> {
      return new Promise((resolve, reject) => {
        if (replFunc == undefined) {
          reject("Invalid command!");
        } else {
          resolve(replFunc(splitInput));
        }
      });
  }

  function handleMode(){
    props.setIsVerbose(!props.isVerbose);

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
    // console.log("current contents " + textbox);
    // props.setHistory([...props.history, textbox]);
    //...props.history means everything that is in props.history, just adding textbox to the end
    props.setTextboxArray([...props.textboxArray, textbox]);
    splitInput = textbox.split(" ");
    switch (splitInput[0]) {
      case "mode":
        handleMode();
        break;
      default:
         let replFunc = registeredFunctions.get(splitInput[0]);
        //  if(splitInput[0] == "view"){
        //   getResponse(replFunc).then((response) => {
        //   props.setHistory([...props.history, "commmand: view, result: ", response]);
        //   });
        //  }else{
          getResponse(replFunc).then((response) => {
          props.setHistory([...props.history, response]);
          })
        //};
       //need a case for wrong commands that have not been inputted
        break;
      // case "view":
      //   view();
      //   break;
      // case "search":
      //   search();
      //   break;
      // default:
      //   // notACommand();
      //   break;
    }

    setTextbox("");
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
