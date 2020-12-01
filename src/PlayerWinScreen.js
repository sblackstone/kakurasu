import { NewGameForm } from './NewGameScreen';

export function PlayerWinScreen(props) {

  return (
    <div className="player-win-screen">
    <h1>YOU WIN!</h1>
    <h5>Again?</h5>
    <NewGameForm {...props} />
    </div>
  )
}
