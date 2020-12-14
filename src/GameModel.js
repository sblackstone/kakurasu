const TARGET_BOARD_FILL_RATIO = 0.60;

export class GameModel {
  constructor(size, solverDebugFn) {
    this.size = size;
    this.solverDebugFn = solverDebugFn;
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

    };
    
    window.waysToMake = this.waysToMake.bind(this);
    
    
  }
  
  async debugDraw() {
    this.solverDebugFn(this);
    return new Promise((resolve,reject)=> {
      setTimeout(()=> { resolve(); }, 5);
    });
    
  }
  
  getSquare(x,y) {
    return this.playerBoard[x][y];
  }

  initTargetBoard() {
    this.targetBoard = [];    
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        if (Math.random() > (1 - TARGET_BOARD_FILL_RATIO)) {
          row.push('*');          
        } else {
          row.push('x');                    
        }
      }
      this.targetBoard.push(row);
    }
  }
  
  availableInRow(i) {
    let result = [];
    for (let j = 0; j < this.size; j++) {
      if (this.getSquare(i,j) === '') {
        result.push(j+1);
      }
    }
    return result;
  }

  availableInCol(j) {
    let result = [];
    for (let i = 0; i < this.size; i++) {
      if (this.getSquare(i,j) === '') {
        result.push(i+1);
      }
    }
    return result;
  }


  valuesCommonToAll(arrays) {
    let data = {};
    
    for (let i = 0; i < arrays.length; i++) {
      for (let j = 0; j < arrays[i].length; j++) {
        const v = arrays[i][j];
        data[v] = data[v] || 0;
        data[v] += 1;
      }
    }
    
    let result = [];
    for (const [k,v] of Object.entries(data)) {
      if (v === arrays.length) {
        result.push(+k);
      }
    }
    
    
    return result;
    
  }
  
  
  async solveFillTooBigTooSmall(i,j) {
    let points = [];
    if ((j+1) > this.meta.rowNeeded[i] || (i+1) > this.meta.colNeeded[j]) {
      // Remove numbers too large for the row/col..
      console.log(`(${i},${j}) cant been green because it would overflow the row/col`);
      this.markSquare(i,j,'x');
      points.push([i,j]);          
      await this.debugDraw();
    } else if ((j+1) > this.meta.antiRowNeeded[i] || (i+1) > this.meta.antiColNeeded[j]) {
      // Remove numbers too large for the anti row/col..
      console.log(`(${i},${j}) cant be red because it would overflow the row/col`);
      this.markSquare(i,j,'*');
      points.push([i,j]);          
      await this.debugDraw();
    }
    
    return points;
    
  }
    
  async solveFill() {
    let points = []; 
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.getSquare(i,j) !== '') {
          continue;
        }
                
        points = points.concat(await this.solveFillTooBigTooSmall(i,j));


      }
    }
    
    return points.length === 0 ? points : points.concat(await this.solveFill());
    
    for (let i = 0; i < this.size; i++) {
      if (this.meta.rowNeeded[i] > 0) {
        const waysToCompleteRow = this.waysToMake(this.availableInRow(i), this.meta.rowNeeded[i]);
        if (waysToCompleteRow.length === 1) {
          for (const p of waysToCompleteRow[0]) {
            this.markSquare(i, p-1, '*');
            points.push([i, p-1]);
            await this.debugDraw();

          }
        }
      }
    }

    for (let j = 0; j < this.size; j++) {
      if (this.meta.colNeeded[j] > 0) {
        const waysToCompleteCol = this.waysToMake(this.availableInCol(j), this.meta.colNeeded[j]);
        if (waysToCompleteCol.length === 1) {
          for (const p of waysToCompleteCol[0]) {
            points.push([p-1,j]);
            this.markSquare(p-1, j, '*');
          }
        }
      }
    }

    
  }

  
  waysToMake(available, target, curSum = 0, candidiate = [], solutions = []) {

    if (curSum === target) {
      solutions.push([ ...candidiate ]);
      return;
    }
    
    if (available.length === 0 || curSum > target) {
      return candidiate.length === 0 ? [] : null;
    }

    const cur = available.pop();

    this.waysToMake(available, target, curSum+cur, [ ...candidiate, cur], solutions );
    this.waysToMake(available, target, curSum,     [ ...candidiate     ], solutions );      

    available.push(cur);

    return solutions
  }
  
  
  unSolveFill(points) {
    return this.markAllPoints(points, '');
  }
  
  markAllPoints(points, newValue) {
    for (let i = 0; i < points.length; i++) {
      this.markSquare(points[i][0], points[i][1], newValue);
    }
    
  }
  

  // todo
  async solve(maxDepth=Infinity, timeout = Infinity, depth = 0, startTs = (+new Date())) {  
    let answer = null;
    let initialPoints = null;
    
    if (depth > maxDepth) {
      console.log(`MaxDepth Reached`);
      return false;
    }
    if ((+new Date()) - startTs > timeout) {
      console.log(`Timeout Reached`);
      return false;
    }
    
    if (depth === 0) {
      initialPoints = await this.solveFill();
      // Solvefill can sometimes solve it..
      if (this.checkWinSolver()) {
        const result = this.export();
        this.unSolveFill(initialPoints);
        return result;
      }
    }
    
    if (this.shouldReject()) {
      console.log("REJECT");
      return false;
    }

    if (this.checkWinSolver()) {
      throw "BLARG";
      return this.export();
    }


    for (let i = 0; i < this.size; i++) {
      if (this.meta.rowNeeded[i] > 0) {
        const ways = this.waysToMake(this.availableInRow(i), this.meta.rowNeeded[i]);
        for (let j = 0; j < ways.length; j++) {
          const curPoints = ways[j].map(x => [i, x-1]);
          this.markAllPoints(curPoints, '*');
          const points = await this.solveFill();
          answer = await this.solve(maxDepth, timeout, depth+1, startTs);
          this.unSolveFill(points);
          this.unSolveFill(curPoints);
          if (answer) {
            break;
          }
        }
      }
    };


    if (depth === 0) {
      this.unSolveFill(initialPoints);
      console.log("Solver Complete");
    }
    return answer;
    
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
      return true;
    }

    if (this.meta.colNeeded.some(x => x < 0)) {
      return true;
    }

    if (this.meta.antiRowNeeded.some(x => x < 0)) {
      return true;
    }

    if (this.meta.antiColNeeded.some(x => x < 0)) {
      return true;
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
    
    
    // Undo whats currently there!
    switch(this.getSquare(x,y)) {
    case '*':
      this.meta.rowSums[x]       -= (y+1);
      this.meta.colSums[y]       -= (x+1);
      this.meta.rowNeeded[x]     += (y+1);
      this.meta.colNeeded[y]     += (x+1);      
      break;
    case 'x':
      this.meta.antiRowSums[x]   -= (y+1);
      this.meta.antiColSums[y]   -= (x+1);    
      this.meta.antiRowNeeded[x] += (y+1);
      this.meta.antiColNeeded[y] += (x+1);      
      break;
    default:
      break; 
    }

    // Put in the new piece!
    switch(val) {
    case '*':
      this.meta.rowSums[x]       += (y+1);
      this.meta.colSums[y]       += (x+1);
      this.meta.rowNeeded[x]     -= (y+1);
      this.meta.colNeeded[y]     -= (x+1);      
      break;
    case 'x':
      this.meta.antiRowSums[x]   += (y+1);
      this.meta.antiColSums[y]   += (x+1);    
      this.meta.antiRowNeeded[x] -= (y+1);
      this.meta.antiColNeeded[y] -= (x+1);      
      break;
    default:
      break; 
    }
    
    this.playerBoard[x][y] = val; // THIS ONE IS OK!

  }
  
  toggleSquare(x,y) {
    switch(this.playerBoard[x][y]) {
    case '*':
      this.markSquare(x,y, "x");    
      break;
    case 'x':
      this.markSquare(x,y, "");    
      break;
    default:
      this.markSquare(x,y, '*');
      break;
    }      
  }

}




