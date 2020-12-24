import './App.scss';
import { Board } from './Board';
import { NewGameScreen } from './NewGameScreen';
import { InGameMenu } from './InGameMenu';
import { PlayerWinScreen } from './PlayerWinScreen';
import { GameModel } from './GameModel';
import { useState } from 'react';
import { Solver } from './Solver';

function App() {
  const [ gm, setGm ] = useState(null);
  const [ viewState, setViewState ] = useState(null);
  const [ menuState, setMenuState ] = useState(false);

  const draw = () => { 
    if (gm) { 
      setViewState(gm.export());  
    } 
  };

  window.draw = draw.bind(this);

  const onMenuOpenClick = function() {
    setMenuState(true);
  }

  const onCloseInGameMenuScreen = function() {
    setMenuState(false);  
  }

  const onGotoNewGameClick = function() {
    setGm(null);
    setViewState(null);
  }
  const onSquareClick = function(i,j) {
    gm.toggleSquare(i,j);
    gm.debug();
    draw();
  } 
 
  const solverDebugFn = (passedGm) => {
    draw();   
  };
 
  const onRestart = () => {
    console.log("Calling GM.restart()");
    gm.restart();
    setMenuState(false);  
    setViewState(gm.export());
  }

  const onNewGame = function(newSize) {
    let newGm = new GameModel(newSize, solverDebugFn);
    let solver = new Solver(newGm);
    setMenuState(false);  
    while (!solver.hasSolution()) {
      console.log("No Solution");
      newGm = new GameModel(newSize, solverDebugFn);
      solver = new Solver(newGm);
    }

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

  if (menuState) {
    return (
      <div className="container">
        <InGameMenu viewState={viewState} onCloseInGameMenuScreen={onCloseInGameMenuScreen} onGotoNewGameClick={onGotoNewGameClick} onRestart={onRestart} />
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
