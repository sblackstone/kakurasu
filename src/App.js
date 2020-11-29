import logo from './logo.svg';
import './App.css';
import { Board } from './Board';
import { GameModel } from './GameModel';
import { useState } from 'react';
function App() {
  const gm = new GameModel(5);

  const [ viewState, setViewState ] = useState(gm.export());

  window.gm = gm;
  return (
    <div className="container">
      <Board size={5} viewState={viewState} />
    </div>
  );
}

export default App;
