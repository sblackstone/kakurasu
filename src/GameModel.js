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
        row.push(`${i}:${j}`);
      }
      this.board.push(row);
    }
  }
  
  rowSums() {
    return [11,22,33,44,55];
  }
  
  colSums() {
    return [111,222,333,444,555];
    
  }
  
  export() {
    return {
      board: this.board.map(x => x.slice(0)),
      rowSums: this.rowSums(),
      colSums: this.colSums()
    }
  }
  
  setSquare(x,y,z) {
    this.board[x][y] = z; 
  }

  getSquare(x,y) {
    return this.board[x][y];
  }

}