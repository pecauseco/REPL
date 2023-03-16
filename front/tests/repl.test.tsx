import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../src/components/Header";
import { registerCommand } from "../src/components/InputBox";
import { mockLoad } from "./MockAPI";
import { mockSearch } from "./MockAPI";
import { mockView } from "./MockAPI";
import App from "../src/App";
import { resetFile } from "./MockAPI";

let history: HTMLElement;
let input: HTMLInputElement;
let button: HTMLElement;




function initFuncMap(){
  registerCommand("mock_load", mockLoad)
  registerCommand("mock_search", mockSearch);
  registerCommand("mock_view", mockView);
}

beforeEach(() => {
 window.HTMLElement.prototype.scrollIntoView = function() {};
  render(<App />);
  initFuncMap();
  resetFile();
  history = screen.getByTestId("repl-history");
  input = screen.getByTestId("input-box")
  button = screen.getByTestId("button");
})


 test("basic math", () => {
   expect(1 + 1).toBe(2);
 });
/*
 * This is an example test file.
 * It is meant to be a starting point for writing your own tests.
 * Feel free to research all the other functions that Jest and Testing Library provide!
 */


