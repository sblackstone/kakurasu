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
  
  rowSums(boardName, targetChar) {
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
  
  colSums(boardName, targetChar) {
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
      sigma: ((this.size) * (this.size + 1)) / 2,
      playerBoard: this.playerBoard.map(x => x.slice(0)),
      rowSums: this.rowSums("playerBoard", "*"),
      colSums: this.colSums("playerBoard", "*"),
      antiRowSums: this.rowSums("playerBoard", "x"),
      antiColSums: this.colSums("playerBoard", "x"),
      targetRowSums: this.rowSums("targetBoard", "*"),
      targetColSums: this.colSums("targetBoard", "*"),
      antiTargetRowSums: this.rowSums("targetBoard", "x"),
      antiTargetColSums: this.colSums("targetBoard", "x"),

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