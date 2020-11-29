export class GameModel {
  constructor(size) {
    this.size = size;
    this.initPlayerBoard();    
    this.initTargetBoard();
  }

  initTargetBoard() {
    this.targetBoard = [];    
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        if (Math.random() > 0.40) {
          row.push('*');          
        } else {
          row.push('x');                    
        }
      }
      this.targetBoard.push(row);
    }
  }


  initPlayerBoard() {
    this.playerBoard = [];    
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        row.push('');
      }
      this.playerBoard.push(row);
    }
  }
  
  rowSums(boardName="playerBoard", targetChar="*") {
    let result = [];
    for (let i = 0; i < this.size; i++) {
      let sum = 0;
      for (let j = 0; j < this.size; j++) {
        if (this[boardName][i][j] === targetChar) {
          sum += (j+1);
        }
      }
      result.push(sum);
    };
    return result;
  }
  
  colSums(boardName = "playerBoard", targetChar="*") {
    let result = [];
    for (let i = 0; i < this.size; i++) {
      let sum = 0;
      for (let j = 0; j < this.size; j++) {
        if (this[boardName][j][i] === targetChar) {
          sum += (j+1);
        }
      }
      result.push(sum);
    };
    return result;
    
  }
  
  export() {
    return {
      size: this.size,
      playerBoard: this.playerBoard.map(x => x.slice(0)),
      rowSums: this.rowSums(),
      colSums: this.colSums(),
      targetRowSums: this.rowSums("targetBoard"),
      targetColSums: this.colSums("targetBoard")
    }
  }
  
  debug(boardName="playerBoard") {
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(this[boardName][i][j]);
      }
      console.log(row);
    }
  }
  
  toggleSquare(x,y) {
    if (this.playerBoard[x][y] === "*") {
      this.playerBoard[x][y] = "x";
    } else if (this.playerBoard[x][y] === "x") {
      this.playerBoard[x][y] = "";
    } else if (this.playerBoard[x][y] === "") {
      this.playerBoard[x][y] = "*";
    }
      
  }

}