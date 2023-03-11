interface HistoryBoxProps {
  history: string[];
}

function HistoryBox(props: HistoryBoxProps) {
  return (
    <div className="repl-history">
      {props.history.map((text) => (
        <div>{text}</div>
      ))}
      {/* TODO: Add a div for each command in the history */}
      {/* Hint: You can use the map function to iterate over an array */}
    </div>
  );
}

export default HistoryBox;
