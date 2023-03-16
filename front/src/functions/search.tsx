import { REPLFunction } from "../interfaces/REPLFunction";

export interface searchResponse {
  result: string;
  search_result: string[];
}
export const Search: REPLFunction = async (
  splitInput: Array<string>
): Promise<string> => {

    let response: Response;
    console.log(splitInput);
    if (splitInput.length < 2) {
      return "result: please provide a search value";
      

    } else if (splitInput.length == 3) {
      const col: string = splitInput[2];
      response = await fetch(
        "http://localhost:3233/searchcsv?value=" +
          splitInput[1] +
          "colindex=" +
          col
      );
    } else {
      if (splitInput[1] == "") {
          return "result: please provide a search value";
        
     
      }
      response = await fetch(
        "http://localhost:3233/searchcsv?value=" + splitInput[1]
      );
    }
    const responseJson: searchResponse = await response.json();
    console.log(responseJson);
    const result = responseJson.result;
    const searchResult = responseJson.search_result;
    return "result: " + result + ", search result: " + searchResult;
    
  };

