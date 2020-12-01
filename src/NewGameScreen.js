import { useState } from 'react';

function LevelOptions(props) {
  let result = [];
  for (let i = props.min; i <= props.max; i++) {
      result.push(
        <option value={i}>{i}x{i}</option>
      )
  }
  return result;
}


export function NewGameScreen(props) {

  const [ newLevel, setNewLevel ] = useState(5);

  return (
    <div className="new-game-screen">
    <h1>New Game</h1>
    
    <select value={newLevel} onChange={(e)=> { setNewLevel(parseFloat(e.currentTarget.value)); }} >
      <LevelOptions min={2} max={13} />
    </select>

    <button onClick={()=> { props.onNewGame(newLevel)}}>Go!</button>
    </div>


  )
}
