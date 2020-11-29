export class GameModel {
  constructor(size) {
    this.size = size;
    this.initBoard();    
  }

  initBoard() {
    this.board = [];    
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(`${i}${j}`);
      }
      this.board.push(row);
    }
  }
  
  setSquare(x,y,z) {
    this.board[x][y] = z; 
  }

  getSquare(x,y) {
    return this.board[x][y];
  }

}