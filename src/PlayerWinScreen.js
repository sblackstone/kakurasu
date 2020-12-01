import { NewGameForm } from './NewGameScreen';

export function PlayerWinScreen(props) {

  return (
    <div className="player-win-screen">
    <h1>YOU WIN!</h1>
    <h3>Again?</h3>
    <NewGameForm {...props} />
    </div>
  )
}
