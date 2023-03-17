
//adapted from hmasamur-tchandar repo
import { REPLFunction } from "../src/interfaces/REPLFunction";
import { fileMap, resultMap } from "./mockData";

import { ReactElement } from "react";

let cur_file: string[][] | undefined = [[]];
let filename: string;

export const mockLoad: REPLFunction = function (
  args: Array<string>
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (args.length < 2) {
      resolve(
        "Please specify a file to load"
      );
    } else {
      const file = args[1];
      const hasHeader = args[2];
      if (fileMap.has(file)) {
        const data = fileMap.get(file);
        if (data != null) {
          cur_file = fileMap.get(file);
          filename = file;
          resolve("File " + filename + " successfully loaded!");
        }
      } else {
        resolve("The given file was not found! Please load a valid file.");
      }
    }
  });
};

export const mockSearch: REPLFunction = function (
  args: Array<string>
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(filename)
    if (args.length < 2) {
      resolve("Please specify a column and search value.");
    } else if(filename == ""){
      console.log("no file")
      resolve("Please load a file.")
    }else {
      const value = args[1];
      if (resultMap.has(value)) {
        const result = resultMap.get(value);
        if (result != null) {
          resolve(result.toString());
        }
      } else {
        resolve("No results found.");
      }
    }
  });
};

export const mockView: REPLFunction = function (
  args: Array<string>
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (cur_file == null || filename == "") {
      resolve("Please load a valid file before viewing.");
    } else {
      resolve(makeTable(cur_file));
    }
  });
};

export function resetFile() {
  cur_file = [[]];
  filename = "";
}

function makeTable(fileData: Array<Array<string>> | null): string {
  if (fileData == null) {
    return "Please input a correct 2D array.";
  }

  // referenced from https://stackoverflow.com/questions/15164655/generate-html-table-from-2d-javascript-array
  //also referenced from sprint-2-hmasamur-jwan8
  var result = "<table align='center'> \n";
  for (var i = 0; i < fileData.length; i++) {
    result += "\t <tr> \n";
    for (var j = 0; j < fileData[i].length; j++) {
      result += "\t \t <td>" + fileData[i][j] + "</td> \n";
    }
    result += "\t </tr> \n";
  }
  result += "</table>";
  return result;
}
