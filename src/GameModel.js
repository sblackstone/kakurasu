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
      rowSumRemaining: this.rowSums("targetBoard", "*"),
      colSumRemaining: this.colSums("targetBoard", "*"),
      antiRowSums: Array(this.size).fill(0),
      antiColSums: Array(this.size).fill(0),      
      antiRowSumRemaining: this.rowSums("targetBoard", "x"),
      antiColSumRemaining: this.colSums("targetBoard", "x"), 

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

  // Takes the previous move and sees if we can short-circuit some options...
  solveFill(x,y) {
    const points = [];
    if (this.meta.rowSumRemaining[x] === 0) {
      for (let i = 0; i < this.size; i++) {
        if (this.playerBoard[x][i] === "") {
          this.playerBoard[x][i] = "x";
          points.push([x,i]);
        }
      }  
    }

    if (this.meta.colSumRemaining[y] === 0) {
      for (let i = 0; i < this.size; i++) {
        if (this.playerBoard[i][y] === "") {
          this.playerBoard[i][y] = "x";
          points.push([i,y]);
        }
      }  
    }
    return points;
  }
  
  
  unSolveFill(points) {
    for (let i = 0; i < points.length; i++) {
      this.playerBoard[points[i][0]][points[i][1]] = "";
    }
  }

  // todo
  solve(depth = 0) {
    if (depth === 0) {
      for (let i = 0; i < this.size; i++) {
        this.solveFill(0,i);
      }
    }
    
    if (this.shouldReject()) {
      return;
    }

    if (this.checkWinSolver()) {
      console.log("solution");
      throw Error("BLARG");
      this.debug();
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.playerBoard[i][j] === "") {
          this.toggleSquareSolver(i,j);
          const points = this.solveFill(i,j);
          this.solve(depth+1);
          this.unSolveFill(points);
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
    
    if (this.meta.rowSumRemaining.some(x => x < 0)) {
      return false;
    }

    if (this.meta.colSumRemaining.some(x => x < 0)) {
      return false;
    }

    if (this.meta.antiRowSumRemaining.some(x => x < 0)) {
      return false;
    }

    if (this.meta.antiColSumRemaining.some(x => x < 0)) {
      return false;
    }

    return false;
  }
  
  checkWin() {
    
    if (this.meta.rowSumRemaining.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.colSumRemaining.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.antiRowSumRemaining.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.antiColSumRemaining.some(x => x !== 0)) {
      return false;
    }
    
    return true;
  }
  
  
  checkWinSolver() {
    if (this.meta.rowSumRemaining.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.colSumRemaining.some(x => x !== 0)) {
      return false;
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
      this.meta.rowSumRemaining[x]     -= (y+1);
      this.meta.colSumRemaining[y]     -= (x+1);      


    } else {
      this.playerBoard[x][y] = "";
      this.meta.rowSums[x]          -= (y+1);
      this.meta.colSums[y]          -= (x+1);            
      this.meta.rowSumRemaining[x]  += (y+1);
      this.meta.colSumRemaining[y]  += (x+1);      

    }
  }
  
  toggleSquare(x,y) {
    console.log(x,y);
    
    // * -> x
    if (this.playerBoard[x][y] === "*") {
      this.meta.rowSums[x]             -= (y+1);
      this.meta.colSums[y]             -= (x+1);
      this.meta.rowSumRemaining[x]     += (y+1);
      this.meta.colSumRemaining[y]     += (x+1);      

      this.meta.antiRowSums[x]         += (y+1);
      this.meta.antiColSums[y]         += (x+1);    
      this.meta.antiRowSumRemaining[x] -= (y+1);
      this.meta.antiColSumRemaining[y] -= (x+1);      
      this.playerBoard[x][y] = "x";
      
    } else if (this.playerBoard[x][y] === "x") {
      // x -> ""
      this.meta.antiRowSums[x] -= (y+1);
      this.meta.antiColSums[y] -= (x+1);    
      this.meta.antiRowSumRemaining[x] += (y+1);
      this.meta.antiColSumRemaining[y] += (x+1);      


      this.playerBoard[x][y] = "";
    } else if (this.playerBoard[x][y] === "") {
      this.meta.rowSums[x]     += (y+1);
      this.meta.colSums[y]     += (x+1);

      this.meta.rowSumRemaining[x] -= (y+1);
      this.meta.colSumRemaining[y] -= (x+1);      

      this.playerBoard[x][y] = "*";
    }
      
  }

}


/*

      sigma: ((this.size) * (this.size + 1)) / 2,
      targetRowSums: this.rowSums("targetBoard", "*"),
      targetColSums: this.colSums("targetBoard", "*"),
      antiTargetRowSums: this.rowSums("targetBoard", "x"),
      antiTargetColSums: this.colSums("targetBoard", "x"), 
      rowSums:     Array(this.size).fill(0),
      colSums:     Array(this.size).fill(0),
      rowSumRemaining: this.rowSums("targetBoard", "*"),
      colSumRemaining: this.colSums("targetBoard", "*"),
      antiRowSums: Array(this.size).fill(0),
      antiColSums: Array(this.size).fill(0),      
      antiRowSumRemaining: this.rowSums("targetBoard", "x"),
      antiColSumRemaining: this.colSums("targetBoard", "x"), 

*/