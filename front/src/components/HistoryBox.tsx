interface HistoryBoxProps {
  history: string[];
  isVerbose: boolean;
  textboxArray: string[];
}

function checkView(text: string){
  if (text.startsWith("<table align='center'>")) {
    return <div dangerouslySetInnerHTML={{ __html: text}} />
  }else{
    return <div>{text}</div>
  }
}

function HistoryBox(props: HistoryBoxProps) {
 
  return (
    <div
      className="repl-history"
      aria-label="History Box"
      aria-description="This is the history box. The responses to your commands will appear here"
    >
      {props.history.map((text, index) => (
        <div>
          {props.isVerbose ? (
            <div aria-label="Command Results"
            aria-description="This is the Command Name and Results because you are in Verbose Mode">
              {"Command: " + props.textboxArray[index]}
              {checkView(text)}
            </div>
          ) : (
            <div aria-label="Command Results" aria-description="This is the Results of the command because you are in brief mode">{checkView(text)}</div>
          )}
        </div>
      ))}

      {/* TODO: Add a div for each command in the history */}
      {/* Hint: You can use the map function to iterate over an array */}
    </div>
  );
}

export default HistoryBox;
