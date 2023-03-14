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
  const commandIndex = 0;
  return (
    <div className="repl-history">
      {props.history.map((text) => (
        <div>
      { props.isVerbose ? (
        <div>
      {props.textboxArray[commandIndex]}
      {checkView(text)}
      </div> )
      : (<div>{checkView(text)}</div>)
    }</div>))}
      
      {/* TODO: Add a div for each command in the history */}
      {/* Hint: You can use the map function to iterate over an array */}
    </div>
  );
}

export default HistoryBox;
