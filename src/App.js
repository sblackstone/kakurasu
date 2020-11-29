import logo from './logo.svg';
import './App.css';
import { Board } from './Board';
import { GameModel } from './GameModel';
import { useState } from 'react';


function App() {
  const [ gm, setGm ] = useState(new GameModel(6));
    
  const [ viewState, setViewState ] = useState(gm.export());

  const onSquareClick = function(i,j) {
    gm.toggleSquare(i,j);
    gm.debug();
    setViewState(gm.export());
    console.log(i,j);
  } 
 
  window.gm = gm;
  return (
    <div className="container">
      <Board size={gm.size} onSquareClick={onSquareClick} viewState={viewState} />
    </div>
  );
}

export default App;
