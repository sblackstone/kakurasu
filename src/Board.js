function Square(props) {
  const content = props.viewState.playerBoard[props.row][props.col];
  let className = "";
  if (content === "*") {
    className = "piece piece-on";
  } else if (content === "x") {
    className = "piece piece-off";
  } else {
    className = "piece piece-blank"
  }

  return (
    <div onClick={()=> { props.onSquareClick(props.row, props.col)}} className={`square square-${props.size}`}>
      <div onClick={()=> { props.onSquareClick(props.row, props.col)}} className={`piece ${className}`}></div>
    </div> 
  );
}

function HSquare(props) {
  let content = "";
  
  if (props.i > 0 && (props.i < props.size+1)) {
    content = props.i;
    return (
      <div className={`square header-square square-${props.size}`}>{content}</div>
    );
  } else {
    return (
      <div className={`square header-square square-${props.size}`}>{content}</div>
    );    
  }
}


function FSquare(props) {
  let content = "";
  if (props.i > 0 && (props.i < props.size+1)) {
    const playerVal = props.viewState.colSums[props.i-1];
    const targetVal = props.viewState.targetColSums[props.i-1];

    const antiPlayerVal = props.viewState.antiColSums[props.i -1];
    const antiTargetVal = props.viewState.antiTargetColSums[props.i - 1];


    content = `${playerVal} / ${targetVal}, ${antiPlayerVal} / ${antiTargetVal}`;
  }


  return (
    <div className={`square footer-square square-${props.size}`}>{content}</div> 
  );
}


function RowStartSquare(props) {
  return (
    <div className={`square row-start-square square-${props.size}`}>{props.i}</div> 
  );
}

function RowEndSquare(props) {
  const playerVal = props.viewState.rowSums[props.row];
  const targetVal = props.viewState.targetRowSums[props.row];
  const antiPlayerVal = props.viewState.antiRowSums[props.row];
  const antiTargetVal = props.viewState.antiTargetRowSums[props.row];


  const content = `${playerVal} / ${targetVal}, ${antiPlayerVal} / ${antiTargetVal}`;

  return (
    <div className={`square row-end-square square-${props.size}`}>{content}</div> 
  );
}



function Header(props) {
  let result = [];
  for (let i = 0; i < props.size +2; i++) {
    result.push(<HSquare key={`hs${i}`} i={i} {...props} />);
  }
  return result;
};

function Footer(props) {
  let result = [];
  for (let i = 0; i < props.size +2; i++) {
    result.push(<FSquare key={`fs${i}`} i={i} {...props} />);
  }
  return result;
};

function Squares(props) {
  let result = [ <Header key={"headerSquares"} {...props} />];
  for (let i = 0; i < (props.size + 2)*(props.size); i++) {
    const col = i % (props.size + 2);
    const row = (i - col) / (props.size + 2);
    if (col === 0) {
      result.push(<RowStartSquare key={`rss${i}`} i={row+1} {...props} />);    
    } else if (col === (props.size + 1)) {
      result.push(<RowEndSquare key={`res${row}`} row={row} {...props} />);    
    } else {
      result.push(<Square key={`reg${i}`} i={i} row={row} col={col-1} {...props} />);
    }
  }
  return [...result, <Footer key={"footerSquares"} {...props} />];
}

export function Board(props) {
  return (
    <div className="board">
      <Squares {...props} />
    </div>
  )
}

