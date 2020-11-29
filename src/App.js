import './App.css';
import { Board } from './Board';
import { GameModel } from './GameModel';
import { useState } from 'react';


function App() {
  const model = new GameModel(4);
  const [ gm, setGm ] = useState(model);
  const [ viewState, setViewState ] = useState(model.export());

  const onSquareClick = function(i,j) {
    gm.toggleSquare(i,j);
    gm.debug();
    setViewState(gm.export());
    console.log(i,j);
  } 
 
 const newGame = function(newSize) {
   const newGm = new GameModel(newSize);
   setGm(newGm);
   setViewState(newGm.export());
 }
 
 window.newGame = newGame.bind(this);
 
  window.gm = gm;
  return (
    <div className="container">
      <Board size={viewState.size} onSquareClick={onSquareClick} viewState={viewState} />
    </div>
  );
}

export default App;
