interface HistoryBoxProps {
  history: string[];
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
    <div className="repl-history">
      {props.history.map((text) => (
        checkView(text)
      ))}
      {/* TODO: Add a div for each command in the history */}
      {/* Hint: You can use the map function to iterate over an array */}
    </div>
  );
}

export default HistoryBox;
