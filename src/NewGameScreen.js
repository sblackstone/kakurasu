import { useState } from 'react';
import React from 'react';

function LevelOptions(props) {
  let result = [];
  for (let i = props.min; i <= props.max; i++) {
      result.push(
        <option value={i}>{i}x{i}</option>
      )
  }
  return result;
}


export function NewGameForm(props) {
  const [ newLevel, setNewLevel ] = useState(5);

    return (
      <React.Fragment>
        <select value={newLevel} onChange={(e)=> { setNewLevel(parseFloat(e.currentTarget.value)); }} >
          <LevelOptions min={3} max={13} />
        </select>
        <button onClick={()=> { props.onNewGame(newLevel)}}>Go!</button>
      </React.Fragment>
      
    )
}


export function NewGameScreen(props) {


  return (
    <div className="new-game-screen">
    <h1>New Game</h1>
    <NewGameForm {...props} />
    </div>


  )
}
