import './App.scss';
import { Board } from './Board';
import { NewGameScreen } from './NewGameScreen';
import { InGameMenu } from './InGameMenu';
import { PlayerWinScreen } from './PlayerWinScreen';
import { GameModel } from './GameModel';
import { useState } from 'react';
import { Solver } from './Solver';


let timeout = null;

function App() {
  const [ gm, setGm ] = useState(null);
  const [ viewState, setViewState ] = useState(null);
  const [ menuState, setMenuState ] = useState(false);
  window.App = gm;


  const onMenuOpenClick = function() {
    setMenuState(true);
  }

  const onCloseInGameMenuScreen = function() {
    alert("BLARG");
    setMenuState(false);  
  }

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

  if (menuState) {
    return (
      <div className="container">
        <InGameMenu viewState={viewState} onCloseInGameMenuScreen={onCloseInGameMenuScreen} onNewGame={onNewGame} />
      </div>
      
    )
  }

  
  if (viewState.wonGame) {
    return (
      <div className="container">
        <PlayerWinScreen viewState={viewState} onNewGame={onNewGame} />
      </div>
      
    )
  }
  
  return (
    <div className="container">
      <Board size={viewState.size} onSquareClick={onSquareClick} viewState={viewState} onMenuOpenClick={onMenuOpenClick} />
    </div>
  );
}

export default App;
