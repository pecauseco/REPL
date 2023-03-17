import { REPLFunction } from "../interfaces/REPLFunction";

export interface viewResponse {
  result: string;
  data: string[][];
}
/**
   * Makes a table representing the data from the csv
   * @param fileData - the data from the loaded csv file
   * @returns a string that is an html representaion of what will be added to the history
   * portion of the page
   */
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
  /**
   * This method gets the view output from the API and then
   * makes a ytable utilizing the output
   * @param splitInput 
   * @returns a promise representing the output from the API
   */
export const View: REPLFunction = async (
  splitInput: Array<string>
): Promise<string> => {
  
    const response: Response = await fetch("http://localhost:3234/viewcsv");
    const responseJson: viewResponse = await response.json();
    const result = responseJson.result;
    const data = responseJson.data;
    
    return makeTable(data);

  
};
