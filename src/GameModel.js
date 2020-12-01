export class GameModel {
  constructor(size) {
    this.size = size;
    this.initPlayerBoard();    
    this.initTargetBoard();
    this.meta = {
      size,
      sigma: ((this.size) * (this.size + 1)) / 2,
      targetRowSums: this.rowSums("targetBoard", "*"),
      targetColSums: this.colSums("targetBoard", "*"),
      antiTargetRowSums: this.rowSums("targetBoard", "x"),
      antiTargetColSums: this.colSums("targetBoard", "x"), 
      rowSums:     Array(this.size).fill(0),
      colSums:     Array(this.size).fill(0),
      antiRowSums: Array(this.size).fill(0),
      antiColSums: Array(this.size).fill(0),      
    }
  }

  initTargetBoard() {
    this.targetBoard = [];    
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        if (Math.random() > 0.70) {
          row.push('*');          
        } else {
          row.push('x');                    
        }
      }
      this.targetBoard.push(row);
    }
  }

  solve() {
    
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
  
  checkWin(state) {
      for ( let i = 0; i < state.size; i++) {

        let a = state.rowSums[i];
        let b = state.targetRowSums[i];
        if (a !== b) {
          return false;
        }

        let c = state.colSums[i];
        let d = state.targetColSums[i];
        if (c !== d) {
          return false;
        }

        let e = state.antiRowSums[i];
        let f = state.antiTargetRowSums[i];
        if (e !== f) {
          return false;
        }


        let g = state.antiColSums[i];
        let h = state.antiTargetColSums[i];
        if (g !== h) {
          return false;
        }

      }
      return true;
  }
  
  export() {
    const result = {
      ...this.meta,
      playerBoard: this.playerBoard.map(x => x.slice(0)),
    }

    result.wonGame = this.checkWin(result);
    
    return result;
    
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
    console.log(x,y);
    if (this.playerBoard[x][y] === "*") {

      this.meta.rowSums[x]     -= (y+1);
      this.meta.colSums[y]     -= (x+1);
      this.meta.antiRowSums[x] += (y+1);
      this.meta.antiColSums[y] += (x+1);    
      this.playerBoard[x][y] = "x";

    } else if (this.playerBoard[x][y] === "x") {
      this.meta.antiRowSums[x] -= (y+1);
      this.meta.antiColSums[y] -= (x+1);    

      this.playerBoard[x][y] = "";
    } else if (this.playerBoard[x][y] === "") {
      this.meta.rowSums[x]     += (y+1);
      this.meta.colSums[y]     += (x+1);

      this.playerBoard[x][y] = "*";
    }
      
  }

}