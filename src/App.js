import logo from './logo.svg';
import './App.css';
import { Board } from './Board';

function App() {
  return (
    <div className="container">
      <Board size={5} />
    </div>
  );
}

export default App;
