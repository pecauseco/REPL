
import { ReactElement } from "react";
import { REPLFunction } from "../src/interfaces/REPLFunction";

export const testFunc: REPLFunction = function (
  args: Array<string>
): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve("New function was correctly registered!");
  });
};