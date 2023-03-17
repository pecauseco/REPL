import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../src/components/Header";
import { registerCommand } from "../src/components/InputBox";
import { mockLoad } from "./MockAPI";
import { mockSearch } from "./MockAPI";
import { mockView } from "./MockAPI";
import { testFunc } from "./testREPLFunc";
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




 test("registerCommand", async () => {
   registerCommand("test", testFunc);
   let user = userEvent.setup();
   await userEvent.type(input, "test");
   await user.click(button);
   expect(
    await screen.findByText("New function was correctly registered!")
   ).toBeInTheDocument();


 });

  test("load_file not existent", async () => {
    let user = userEvent.setup();
    await userEvent.type(input, "mock_load blah false");
    await user.click(button);
    expect(
      await screen.findByText(
        "The given file was not found! Please load a valid file."
      )
    ).toBeInTheDocument();
  });

  test("load_file no argument", async () => {
    let user = userEvent.setup();
    await userEvent.type(input, "mock_load");
    await user.click(button);
    expect(
      await screen.findByText("Please specify a file to load")
    ).toBeInTheDocument();
  });


  test("switching between load_file and searching", async () => {
    let user = userEvent.setup();
    await userEvent.type(input, "mock_load mock1 false");
    await user.click(button);
    expect(
      await screen.findByText("File mock1 successfully loaded!")
    ).toBeInTheDocument();

    await userEvent.type(input, "mock_search Charlie");
    await user.click(button);
    expect(
      await screen.findByText("Charlie,and,Caroline,so,slay.")
    ).toBeInTheDocument();

    await userEvent.type(input, "mock_load mock2 false");
    await user.click(button);
    expect(
      await screen.findByText("File mock2 successfully loaded!")
    ).toBeInTheDocument();

    await userEvent.type(input, "mock_search Ariana");
    await user.click(button);
    expect(
      await screen.findByText("Ariana,Demi,Taylor,Miley,Mariah")
    ).toBeInTheDocument();

    await userEvent.type(input, "mock_load mock3 false");
    await user.click(button);
    expect(
        await screen.findByText("File mock3 successfully loaded!")
    ).toBeInTheDocument();


    await userEvent.type(input, "mock_search Shakira");
    await user.click(button);
    expect(
      await screen.findByText("Shakira,Bad,Bunny")
    ).toBeInTheDocument();

    await userEvent.type(input, "mock_search hi");
    await user.click(button);
    expect(
      await screen.findByText("No results found.")
    ).toBeInTheDocument();
  });

  test("search no file", async () => {
    let user = userEvent.setup();
    await userEvent.type(input, "mock_search hi");
    await user.click(button);
    expect(
      await screen.findByText("Please load a file.")
    ).toBeInTheDocument();
  });

  test("view", async () => {
    let user = userEvent.setup();
    await userEvent.type(input, "mock_load mock1 false");
    await user.click(button);
    await userEvent.type(input, "mock_view");
    await user.click(button);
    expect(await screen.getByRole("table", { name: "" }).innerHTML).toEqual(
      " \n\t <tbody><tr> \n\t \t <td>Charlie</td> \n\t \t <td>and</td> \n\t \t <td>Caroline</td> \n\t \t <td>so</td> \n\t \t <td>slay.</td> \n\t </tr> \n</tbody>"
    );
  });

  test("view after two loads", async () =>{
    let user = userEvent.setup();
    await userEvent.type(input, "mock_load mock1 false");
    await user.click(button);
    await userEvent.type(input, "mock_load mock2 false");
    await user.click(button);
    await userEvent.type(input, "mock_view");
    await user.click(button);

    expect(await screen.getByRole("table", { name: "" }).innerHTML).toContain(
      " \n\t <tbody><tr> \n\t \t <td>Ariana</td> \n\t \t <td>Demi</td> \n\t \t <td>Taylor</td> \n\t \t <td>Miley</td> \n\t \t <td>Mariah</td>"
    );  
  })

  test("view no file", async () =>{
    let user = userEvent.setup();
    await userEvent.type(input, "mock_view");
    await user.click(button);    

    expect(
      await screen.findByText("Please load a valid file before viewing.")
    ).toBeInTheDocument();
  })

  test("changing mode", async () =>{
    let user = userEvent.setup();
    await userEvent.type(input, "mock_load mock1 false");
    await user.click(button);    
    await userEvent.type(input, "mode");
    await user.click(button);    

    expect(
      await screen.findByText("Command: mode")
    ).toBeInTheDocument();

    await userEvent.type(input, "mode");
    await user.click(button);   
    expect(
      await screen.findByText("mode is now in brief")
    ).toBeInTheDocument();

    await userEvent.type(input, "mode");
    await user.click(button);
    expect(await screen.findByText("Command: mock_load mock1 false")).toBeInTheDocument();

  })

  test("entering with button", async () =>{
    let user = userEvent.setup();
    await userEvent.type(input, "mock_load mock1 false");
    await user.keyboard('{Enter}')  
    expect(await screen.findByText("File mock1 successfully loaded!")
    ).toBeInTheDocument();   
  })

  test("invalid command", async ()=> {
    let user = userEvent.setup();
    await userEvent.type(input, "hi");
    await user.click(button);  
    expect(
      await screen.findByText("Please enter a valid command")
    ).toBeInTheDocument();  
  })


  



