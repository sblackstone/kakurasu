import { useState } from 'react';
export function NewGameScreen(props) {

  const [ newLevel, setNewLevel ] = useState(5);

  return (
    <div className="new-game-screen">
    <h1>Start at Level {newLevel}</h1>
    <select value={newLevel} onChange={(e)=> { setNewLevel(parseFloat(e.currentTarget.value)); }} >
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
      <option>10</option>
      <option>11</option>
      <option>12</option>
    </select>

    <button onClick={()=> { props.onNewGame(newLevel)}}>Go!</button>
    </div>


  )
}
