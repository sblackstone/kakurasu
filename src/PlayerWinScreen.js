import { useState } from 'react';
import { NewGameForm } from './NewGameScreen';

export function PlayerWinScreen(props) {

  const [ newLevel, setNewLevel ] = useState(5);

  return (
    <div className="player-win-screen">
    <h1>YOU WIN!</h1>
    <h5>Again?</h5>
    <NewGameForm {...props} />
    </div>


  )
}
