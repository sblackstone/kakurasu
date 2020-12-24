export function InGameMenu (props) {

  return (
    <div className="ingame-menu-screen">
      <button onClick={props.onGotoNewGameClick}>Start New Game</button>
      <button onClick={props.onRestart}>Restart</button>
      <button onClick={props.onCloseInGameMenuScreen}>Close</button>
    </div>
  )
}
