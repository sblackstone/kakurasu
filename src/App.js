import './App.css';
import { Board } from './Board';
import { NewGameScreen } from './NewGameScreen';
import { GameModel } from './GameModel';
import { useState } from 'react';


function App() {
  const model = null;
  const [ gm, setGm ] = useState(null);
  const [ viewState, setViewState ] = useState(null);

  const onSquareClick = function(i,j) {
    gm.toggleSquare(i,j);
    gm.debug();
    setViewState(gm.export());
  } 
 
  const onNewGame = function(newSize) {
    const newGm = new GameModel(newSize);
    setGm(newGm);
    setViewState(newGm.export());
  }
   
  window.gm = gm;
  if (viewState === null) {
    return (
      <div className="container">
        <NewGameScreen onNewGame={onNewGame} />
      </div>
    );
  }
  return (
    <div className="container">
      <Board size={viewState.size} onSquareClick={onSquareClick} viewState={viewState} />
    </div>
  );
}

export default App;
