const math = require('mathjs');



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

      // What the current row/colums add up to.
      rowSums:     Array(this.size).fill(0),
      colSums:     Array(this.size).fill(0),

      // How much they need to complete green.
      rowNeeded: this.rowSums("targetBoard", "*"),
      colNeeded: this.colSums("targetBoard", "*"),


      ///////
      antiTargetRowSums: this.rowSums("targetBoard", "x"),
      antiTargetColSums: this.colSums("targetBoard", "x"), 
      antiRowSums: Array(this.size).fill(0),
      antiColSums: Array(this.size).fill(0),      
      antiRowNeeded: this.rowSums("targetBoard", "x"),
      antiColNeeded: this.colSums("targetBoard", "x"), 

    }
  }
    

  solveLinearAlgebra() {
    const mData = Array(this.size*this.size).fill(0).map(x => Array(this.size*this.size).fill(0));

    // For Each Row...
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        mData[i][i*this.size +j] = j+1;
        mData[i+this.size][j*this.size + i] = j+1;

      }
    }
    
    const b = [ ...this.meta.targetRowSums, ...this.meta.targetColSums];
    
    // Unfinished... At this point, we would like to solve this matrix...

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
  
  solveFill() {
    const points = []; 
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.playerBoard[i][j] !== '') {
          continue;
        }
        if ((j+1) > this.meta.rowNeeded[i] || (i+1) > this.meta.colNeeded[j]) {
          this.playerBoard[i][j] = "x";
          points.push([i,j]);          
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
      this.solveFill();
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
          this.markSquare(i,j, '*');
          const points = this.solveFill();
          this.solve(depth+1);
          this.unSolveFill(points);
          this.markSquare(i,j, '');
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
    
    if (this.meta.rowNeeded.some(x => x < 0)) {
      return false;
    }

    if (this.meta.colNeeded.some(x => x < 0)) {
      return false;
    }

    if (this.meta.antiRowNeeded.some(x => x < 0)) {
      return false;
    }

    if (this.meta.antiColNeeded.some(x => x < 0)) {
      return false;
    }

    return false;
  }
  
  checkWin() {
    
    if (this.meta.rowNeeded.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.colNeeded.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.antiRowNeeded.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.antiColNeeded.some(x => x !== 0)) {
      return false;
    }
    
    return true;
  }
  
  
  checkWinSolver() {
    if (this.meta.rowNeeded.some(x => x !== 0)) {
      return false;
    }

    if (this.meta.colNeeded.some(x => x !== 0)) {
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
    
  markSquare(x,y,val) {
    switch(this.playerBoard[x][y]) {
    case '*':
      this.meta.rowSums[x]             -= (y+1);
      this.meta.colSums[y]             -= (x+1);
      this.meta.rowNeeded[x]     += (y+1);
      this.meta.colNeeded[y]     += (x+1);      
      break;
    case 'x':
      this.meta.antiRowSums[x] -= (y+1);
      this.meta.antiColSums[y] -= (x+1);    
      this.meta.antiRowNeeded[x] += (y+1);
      this.meta.antiColNeeded[y] += (x+1);      
      break;
    case '':
      break; 
    }

    switch(val) {
    case '*':
      this.meta.rowSums[x]     += (y+1);
      this.meta.colSums[y]     += (x+1);
      this.meta.rowNeeded[x] -= (y+1);
      this.meta.colNeeded[y] -= (x+1);      
      break;
    case 'x':
      this.meta.antiRowSums[x]         += (y+1);
      this.meta.antiColSums[y]         += (x+1);    
      this.meta.antiRowNeeded[x] -= (y+1);
      this.meta.antiColNeeded[y] -= (x+1);      
      break;
    case '':
      break; 
    }

    this.playerBoard[x][y] = val;

  }
  
  toggleSquare(x,y) {
    switch(this.playerBoard[x][y]) {
    case '*':
      this.markSquare(x,y, "x");    
      break;
    case 'x':
      this.markSquare(x,y, "");    
      break;
    case '':
      this.markSquare(x,y, '*');
      break;
    }      
  }

}




