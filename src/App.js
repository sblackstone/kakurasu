import logo from './logo.svg';
import './App.css';
import { Board } from './Board';
import { GameModel } from './GameModel';
function App() {
  
  const gm = new GameModel(5);
  window.gm = gm;
  return (
    <div className="container">
      <Board size={5} gm={gm} />
    </div>
  );
}

export default App;
