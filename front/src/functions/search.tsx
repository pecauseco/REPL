import { REPLFunction } from "../interfaces/REPLFunction";

/**
 * This interface represents search and shows that search will have a result
 * and a result array with the list that the thing was found in
 */
export interface searchResponse {
  result: string;
  search_result: string[];
}

/**
 * This method executes the search and returns an informative reponse based on
 * what occurred in the search
 * @param splitInput 
 * @returns a Promise that represents the string result of the search
 */
export const Search: REPLFunction = async (
  splitInput: Array<string>
): Promise<string> => {

    let response: Response;
    if (splitInput.length < 2) {
      return "result: please provide a search value";
      

    } else if (splitInput.length == 3) {
      const col: string = splitInput[2];
      response = await fetch(
        "http://localhost:3234/searchcsv?value=" +
          splitInput[1] +
          "&colindex=" +
          col
      );
    } else {
      if (splitInput[1] == "") {
        return "result: please provide a search value";
      
      }
      response = await fetch(
        "http://localhost:3234/searchcsv?value=" + splitInput[1]
      );
    }
    const responseJson: searchResponse = await response.json();
    const result = responseJson.result;
    const searchResult = responseJson.search_result;
    if (searchResult == undefined){
        return "result: " + result + ", search result not found";
    }
    else{
    return "result: " + result + ", search result: " + searchResult;
    }
  };

