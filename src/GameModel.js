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

  markAllPoints(points, newValue) {
    for (let i = 0; i < points.length; i++) {
      this.markSquare(points[i][0], points[i][1], newValue);
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

  checkWin() {
    return false;
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
