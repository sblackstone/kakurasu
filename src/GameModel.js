export class GameModel {
  constructor(size) {
    this.size = size;
    this.initBoard();    
  }

  initBoard() {
    this.playerBoard = [];    
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(`*`);
      }
      this.playerBoard.push(row);
    }
  }
  
  rowSums() {
    let result = [];
    for (let i = 0; i < this.size; i++) {
      let sum = 0;
      for (let j = 0; j < this.size; j++) {
        if (this.playerBoard[i][j] === "*") {
          sum += (j+1);
        }
      }
      result.push(sum);
    };
    return result;
  }
  
  colSums() {
    let result = [];
    for (let i = 0; i < this.size; i++) {
      let sum = 0;
      for (let j = 0; j < this.size; j++) {
        if (this.playerBoard[j][i] === "*") {
          sum += (j+1);
        }
      }
      result.push(sum);
    };
    return result;
    
  }
  
  export() {
    return {
      playerBoard: this.playerBoard.map(x => x.slice(0)),
      rowSums: this.rowSums(),
      colSums: this.colSums()
    }
  }
  
  setSquare(x,y,z) {
    this.playerBoard[x][y] = z; 
  }

  getSquare(x,y) {
    return this.playerBoard[x][y];
  }

}