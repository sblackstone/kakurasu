import './App.scss';
import { Board } from './Board';
import { NewGameScreen } from './NewGameScreen';
import { PlayerWinScreen } from './PlayerWinScreen';
import { GameModel } from './GameModel';
import { useState } from 'react';
import { Solver } from './Solver';


let timeout = null;

function App() {
  const model = null;
  const [ gm, setGm ] = useState(null);
  const [ viewState, setViewState ] = useState(null);

  window.App = gm;

  const onGotoNewGameClick = function() {
    setGm(null);
    setViewState(null);
  }
  const onSquareClick = function(i,j) {
    gm.toggleSquare(i,j);
    gm.debug();
    setViewState(gm.export());
  } 
 
  const solverDebugFn = (passedGm) => {
    setViewState(passedGm.export());    
  };
 
  const onNewGame = function(newSize) {
    const newGm = new GameModel(newSize, solverDebugFn);
    const solver = new Solver(newGm);
    window.solver = solver;
    setGm(newGm);
    setViewState(newGm.export());
    clearInterval(timeout);
    timeout = setInterval(() => { setViewState(newGm.export()); }, 500);
  }
   
  window.gm = gm;
  if (viewState === null) {
    return (
      <div className="container">
        <NewGameScreen onNewGame={onNewGame} />
      </div>
    );
  }
  
  if (viewState.wonGame && false) {
    return (
      <div className="container">
        <PlayerWinScreen viewState={viewState} onNewGame={onNewGame} />
      </div>
      
    )
  }
  
  return (
    <div className="container">
      <Board size={viewState.size} onSquareClick={onSquareClick} viewState={viewState} />
    </div>
  );
}

export default App;
