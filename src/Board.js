function Square(props) {
  return (
    <div className={`square square-${props.size}`}>S{props.i}</div> 
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
    content = `CS${props.i-1}`; // i-1 i-1 i-1 i-1!!!! its i minus 1.
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
  return (
    <div className={`square row-end-square square-${props.size}`}>RS{props.row}</div> 
  );
}



function Header(props) {
  let result = [];
  for (let i = 0; i < props.size +2; i++) {
    result.push(<HSquare i={i} {...props} />);
  }
  return result;
};

function Footer(props) {
  let result = [];
  for (let i = 0; i < props.size +2; i++) {
    result.push(<FSquare i={i} {...props} />);
  }
  return result;
};


function Squares(props) {
  let result = [ <Header {...props} />];
  for (let i = 0; i < (props.size + 2)*(props.size); i++) {
    const col = i % (props.size + 2);
    const row = (i - col) / (props.size + 2);
    if (col === 0) {
      result.push(<RowStartSquare i={row+1} {...props} />);    
    } else if (col === (props.size + 1)) {
      result.push(<RowEndSquare row={row} {...props} />);    
    } else {
      result.push(<Square i={i} {...props} />);
    }
  }
  return [...result, <Footer {...props} />];
}



export function Board(props) {
  return (
    <div className="board">
      <Squares {...props} />
    </div>
  )
}

