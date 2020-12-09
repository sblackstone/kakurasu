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
    
/*
  solveLinearProgramming() {
    let constraints = [];

    let objective = [];
    
    let bounds = [];
    
    let generals = [];
    
    for (let i = 0; i < this.size*this.size; i++) {
      generals.push(`x${i}`);
      objective.push(`+ x${i}`);
      bounds.push(`0 <= x${i} <= 1`);
    }
    

    // For each row...
    for (let i = 0; i < this.size; i++) {
      let line = [];
      for (let j = 0; j < this.size; j++) {
        const square = i*this.size + j;
        line.push(`${j+1} x${square}`)
      }      
      constraints.push(`RC${i}: + ${line.join(" + ")} = ${this.meta.targetRowSums[i]}`);      
    }

    // For Each col
    for (let i = 0; i < this.size; i++) {
      let line = [];
      for (let j = 0; j < this.size; j++) {
        const square = j*this.size + i;
        line.push(`${i+1} x${square}`)
      }      
      constraints.push(`CC${i}: + ${line.join(" + ")} = ${this.meta.targetColSums[i]}`);      
    }

    let program = `
Minimize
obj: ${objective.join(" ")}
    
Subject To
${constraints.join("\n")}

Bounds
${bounds.join("\n")}

Generals
${generals.join("\n")}

End

`;

console.log(program);

const log = console.log;

const stop = () => console.log("STOP");

const job = new Worker(process.env.PUBLIC_URL + '/main.js');

window.blarg = job;
job.onmessage = function (e) {
    var obj = e.data;
    switch (obj.action){
        case 'log':
            log(obj.message);
            break;
        case 'done':
            stop();
            log(JSON.stringify(obj.result));
            break;
    }
};

job.onerror = function(message) {
  console.log(message);
};


job.postMessage({action: 'load', data: program, mip: true});
    
  }
*/

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
        if ((j+1) > this.meta.rowSumRemaining[i] || (i+1) > this.meta.colSumRemaining[j]) {
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
    
  markSquare(x,y,val) {
    switch(this.playerBoard[x][y]) {
    case '*':
      this.meta.rowSums[x]             -= (y+1);
      this.meta.colSums[y]             -= (x+1);
      this.meta.rowSumRemaining[x]     += (y+1);
      this.meta.colSumRemaining[y]     += (x+1);      
      break;
    case 'x':
      this.meta.antiRowSums[x] -= (y+1);
      this.meta.antiColSums[y] -= (x+1);    
      this.meta.antiRowSumRemaining[x] += (y+1);
      this.meta.antiColSumRemaining[y] += (x+1);      
      break;
    case '':
      break; 
    }

    switch(val) {
    case '*':
      this.meta.rowSums[x]     += (y+1);
      this.meta.colSums[y]     += (x+1);
      this.meta.rowSumRemaining[x] -= (y+1);
      this.meta.colSumRemaining[y] -= (x+1);      
      break;
    case 'x':
      this.meta.antiRowSums[x]         += (y+1);
      this.meta.antiColSums[y]         += (x+1);    
      this.meta.antiRowSumRemaining[x] -= (y+1);
      this.meta.antiColSumRemaining[y] -= (x+1);      
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