import { useState } from 'react';
import { constants } from './constants';
import React from 'react';
import Cookies from 'js-cookie';

function LevelOptions(props) {
  let result = [];
  for (let i = props.min; i <= props.max; i++) {
      result.push(
        <option key={i} value={i}>{i}x{i}</option>
      )
  }
  return result;
}


export function NewGameForm(props) {
  
  const defaultLevel = Cookies.get('defaultLevel') || 6;
  
  const [ newLevel, setNewLevel ] = useState(parseFloat(defaultLevel));

    return (
      <React.Fragment>
        <select value={newLevel} onChange={(e)=> { setNewLevel(parseFloat(e.currentTarget.value)); Cookies.set('defaultLevel', e.currentTarget.value) }} >
          <LevelOptions min={3} max={constants.MAX_LEVEL} />
        </select>
        <button onClick={()=> { props.onNewGame(newLevel)}}>Play</button>
      </React.Fragment>
      
    )
}


export function NewGameScreen(props) {


  return (
    <div className="new-game-screen">
    <h1>Kakurasu++</h1>
    <NewGameForm {...props} />
    </div>


  )
}
