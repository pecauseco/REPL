import { REPLFunction } from "../interfaces/REPLFunction"


export interface loadResponse {
  result: string;
  filepath: string;
}
export const Load: REPLFunction = async (
  splitInput: Array<string>
): Promise<string> => {
    const response: Response = await fetch(
      "http://localhost:3233/loadcsv?filepath=" +
        splitInput[1] +
        "&hasheaders=" +
        splitInput[2]
    );
    const responseJson: loadResponse = await response.json();
    const result = responseJson.result;
    const filepath = responseJson.filepath;
    return  "result: " + result + ", filepath: " + filepath;
    // props.setHistory([
    //   ...props.history,
    //   "result: " + result + ", filepath: " + filepath,
    // ]);
  }