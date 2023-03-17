import { REPLFunction } from "../interfaces/REPLFunction"

/**
 * An interface with the different parts of our load function
 */
export interface loadResponse {
  result: string;
  filepath: string;
}
/**
 * This is a constant representing the API call with the link to our API call
 * It takes in splitInpu and returns a Promise
 */
export const Load: REPLFunction = async (
  splitInput: Array<string>
): Promise<string> => {
    const response: Response = await fetch(
      "http://localhost:3234/loadcsv?filepath=" +
        splitInput[1] +
        "&hasheaders=" +
        splitInput[2]
    );
    const responseJson: loadResponse = await response.json();
    const result = responseJson.result;
    const filepath = responseJson.filepath;
    return  "Loading was a " + result + ", filepath: " + filepath;
  }