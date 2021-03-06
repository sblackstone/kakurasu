import { useState } from 'react';
import { constants } from './constants';


function Square(props) {
  const content = props.viewState.playerBoard[props.row][props.col];
  let className = "";
  if (content === constants.SQUARE_GREEN) {
    className = "piece piece-on";
  } else if (content === constants.SQUARE_RED) {
    className = "piece piece-off";
  } else {
    className = "piece piece-blank"
  }

  return (
    <div onClick={()=> { props.onSquareClick(props.row, props.col)}} className={`square game-square square-${props.size}`}>
      <div className={`piece ${className}`}></div>
    </div> 
  );
}

function HSquare(props) {
  let content = "";
  
  if (props.i > 0 && (props.i < props.size+1)) {
    content = props.i;
    return (
      <div className={`square header-square square-${props.size}`}><div className="value-container">{content}</div></div>
    );
  } else {
    const klass = !props.boardMode ? "delta-on" : "delta-off";
    return (
      <div onClick={props.toggleBoardMode} className={`square ${klass} flipper-square header-square row-start-square square-${props.size}`}>
        <div className="flipper">
            <div className="flipper-top">&#x293A;</div>
            <div className="flipper-bottom">&#x293B;</div>
        </div>
      </div>
    );    
  }
}


function FSquare(props) {
  
  if (props.col >= 0 && (props.col < props.size)) {

    const fillVal = props.boardMode ? "greenNeeded" : "redNeeded";
    const klass   = props.boardMode ? "score score-on" : "score score-off";
    
    return (
      <div className={`square footer-square square-${props.size}`}>
        <div className={klass}>{props.viewState.rows[props.size+props.col][fillVal]}</div>
      </div> 
    );    
  }


  if (props.i === 0) {
    return (
      <div className={`square footer-square row-start-square square-${props.size}`}></div> 
    ); 
  }

  return (
    <div className={`square footer-square row-end-square square-${props.size}`}></div> 
  );
}


function RowStartSquare(props) {
  return (
    <div className={`square row-start-square square-${props.size}`}><div className="value-container">{props.i}</div></div>
  );
}

function RowEndSquare(props) {
    const fillVal = props.boardMode ? "greenNeeded" : "redNeeded";
    const klass   = props.boardMode ? "score score-on" : "score score-off";

    return (
      <div className={`square row-end-square square-${props.size}`}>
        <div className={klass}>{props.viewState.rows[props.row][fillVal]}</div>
      </div> 
    );    


}

  //  <div className={`square sigma-square row-end-square header-square square-${props.size}`}>&Sigma;{props.viewState.sigma}</div>    


function SigmaSquare(props) {
  return (
    <div onClick={props.onMenuOpenClick} className={`square sigma-square row-end-square header-square square-${props.size}`}>&#9881;</div>    
  );
}

function Header(props) {
  let result = [];
  for (let i = 0; i < props.size +1; i++) {
    result.push(<HSquare key={`hs${i}`} i={i} {...props} />);
  }
  result.push(<SigmaSquare key={`hssigma`} {...props} />);
  return result;
};

function Footer(props) {
  let result = [];
  for (let i = 0; i < props.size +2; i++) {
    result.push(<FSquare key={`fs${i}`} col={i-1} i={i} {...props} />);
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
  
  const [ boardMode, setBoardMode ] = useState(true);
  
  const toggleBoardMode = () => {
    setBoardMode(!boardMode);
  };
  
  
  return (
    <div className="board">
      <Squares {...props} boardMode={boardMode} toggleBoardMode={toggleBoardMode} />
    </div>
  )
}

