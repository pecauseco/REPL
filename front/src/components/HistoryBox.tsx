
/**
 * The interface that contaoins all of the history box props
 */
interface HistoryBoxProps {
  history: string[];
  isVerbose: boolean;
  textboxArray: string[];
}

/**
 * Checks to see if the output is view. If it is, it sets the table up. If not
 * it prints it out as text
 * @param - text, the string that represents the output into history
 */
function checkView(text: string){
  if (text.startsWith("<table align='center'>")) {
    return <div dangerouslySetInnerHTML={{ __html: text}} />
  }else{
    return <div>{text}</div>
  }
}

/**
 * This function represents the history box and has a return that returns the HTML elements
 */
function HistoryBox(props: HistoryBoxProps) {
 
  return (
    <div
      className="repl-history"
      data-testid="repl-history"
      aria-label="History Box"
      aria-describedby="This is the history box. The responses to your commands will appear here"
      aria-live="assertive"
    >
      {props.history.map((text, index, arr) =>
        props.isVerbose ? (
          <div
            aria-label="Command Results"
            aria-describedby="This is the Command Name and Results because you are in Verbose Mode"
            aria-live="assertive"
          >
            {"Command: " + props.textboxArray[arr.length - 1 - index]}
            {checkView(text)}
          </div>
        ) : (
          <div
            aria-label="Command Results"
            aria-describedby="This is the Results of the command because you are in brief mode"
            aria-live="assertive"
          >
            {checkView(text)}
          </div>
        )
      )}
    </div>
  );
}

export default HistoryBox;
