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

  // todo
  solve(depth = 0) {
    if (this.shouldReject()) {
      return;
    }

    if (this.checkWinSolver()) {
      console.log("solution");
      this.debug();
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.playerBoard[i][j] === "") {
          this.toggleSquareSolver(i,j);
          this.solve(depth+1);
          this.toggleSquareSolver(i,j);
        }      
      }      
    }
    
    if (depth === 0) {
      console.log("Solver Complete");
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
  
  
  
  shouldReject() {
      for ( let i = 0; i < this.meta.rowSums.length; i++) {

        let a = this.meta.rowSums[i];
        let b = this.meta.targetRowSums[i];
        if (b-a < 0) {
          return true;
        }

        let c = this.meta.colSums[i];
        let d = this.meta.targetColSums[i];
        if (d-c < 0) {
          return true;
        }

        let e = this.meta.antiRowSums[i];
        let f = this.meta.antiTargetRowSums[i];
        if (f-e < 0) {
          return true;
        }


        let g = this.meta.antiColSums[i];
        let h = this.meta.antiTargetColSums[i];
        if (h-g < 0) {
          return true;
        }
      }
      return false;
  }
  
  checkWin() {
      for ( let i = 0; i < this.meta.rowSums.length; i++) {

        let a = this.meta.rowSums[i];
        let b = this.meta.targetRowSums[i];
        if (a !== b) {
          return false;
        }

        let c = this.meta.colSums[i];
        let d = this.meta.targetColSums[i];
        if (c !== d) {
          return false;
        }

        let e = this.meta.antiRowSums[i];
        let f = this.meta.antiTargetRowSums[i];
        if (e !== f) {
          return false;
        }


        let g = this.meta.antiColSums[i];
        let h = this.meta.antiTargetColSums[i];
        if (g !== h) {
          return false;
        }

      }
      return true;
  }
  
  
  checkWinSolver() {
      for ( let i = 0; i < this.meta.rowSums.length; i++) {

        let a = this.meta.rowSums[i];
        let b = this.meta.targetRowSums[i];
        if (a !== b) {
          return false;
        }

        let c = this.meta.colSums[i];
        let d = this.meta.targetColSums[i];
        if (c !== d) {
          return false;
        }

      }
      return true;
  }
  
  
  export() {
    return {
      ...this.meta,
      playerBoard: this.playerBoard.map(x => x.slice(0)),
      wonGame: this.checkWin()
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
  
  toggleSquareSolver(x,y) {
    if (this.playerBoard[x][y] === "") {
      this.playerBoard[x][y] = "*";
      this.meta.rowSums[x]     += (y+1);
      this.meta.colSums[y]     += (x+1);      
    } else {
      this.playerBoard[x][y] = "";
      this.meta.rowSums[x]     -= (y+1);
      this.meta.colSums[y]     -= (x+1);            
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