import { constants } from './constants';

const TARGET_BOARD_FILL_RATIO = 0.60;


export class GameModel {
  constructor(size, solverDebugFn) {
    this.size = size;
    this.solverDebugFn = solverDebugFn;
    this.initPlayerBoard();
    this.initTargetBoard();
    this.state = {
      size,
      sigma: ((this.size) * (this.size + 1)) / 2,
      targetRowSums: this.rowSums("targetBoard", constants.SQUARE_GREEN),
      targetColSums: this.colSums("targetBoard", constants.SQUARE_GREEN),

      // What the current row/colums add up to.
      rowSums:      this.rowSums("playerBoard", constants.SQUARE_GREEN),
      colSums:      this.colSums("playerBoard", constants.SQUARE_GREEN),

      // How much they need to complete green.
      rowNeeded: this.rowSums("targetBoard", constants.SQUARE_GREEN),
      colNeeded: this.colSums("targetBoard", constants.SQUARE_GREEN),


      ///////
      antiTargetRowSums: this.rowSums("targetBoard", constants.SQUARE_RED),
      antiTargetColSums: this.colSums("targetBoard", constants.SQUARE_RED),




      antiRowSums: this.rowSums("playerBoard", constants.SQUARE_RED),
      antiColSums: this.rowSums("playerBoard", constants.SQUARE_RED),
      antiRowNeeded: this.rowSums("targetBoard", constants.SQUARE_RED),
      antiColNeeded: this.colSums("targetBoard", constants.SQUARE_RED),

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
          row.push(constants.SQUARE_GREEN);
        } else {
          row.push(constants.SQUARE_RED);
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
        row.push(constants.SQUARE_EMPTY);
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
      ...this.state,
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
    case constants.SQUARE_GREEN:
      this.state.rowSums[x]       -= (y+1);
      this.state.colSums[y]       -= (x+1);
      this.state.rowNeeded[x]     += (y+1);
      this.state.colNeeded[y]     += (x+1);
      break;
    case constants.SQUARE_RED:
      this.state.antiRowSums[x]   -= (y+1);
      this.state.antiColSums[y]   -= (x+1);
      this.state.antiRowNeeded[x] += (y+1);
      this.state.antiColNeeded[y] += (x+1);
      break;
    default:
      break;
    }

    // Put in the new piece!
    switch(val) {
    case constants.SQUARE_GREEN:
      this.state.rowSums[x]       += (y+1);
      this.state.colSums[y]       += (x+1);
      this.state.rowNeeded[x]     -= (y+1);
      this.state.colNeeded[y]     -= (x+1);
      break;
    case constants.SQUARE_RED:
      this.state.antiRowSums[x]   += (y+1);
      this.state.antiColSums[y]   += (x+1);
      this.state.antiRowNeeded[x] -= (y+1);
      this.state.antiColNeeded[y] -= (x+1);
      break;
    default:
      break;
    }

    this.playerBoard[x][y] = val; // THIS ONE IS OK!

  }

  toggleSquare(x,y) {
    switch(this.playerBoard[x][y]) {
    case constants.SQUARE_GREEN:
      this.markSquare(x,y, constants.SQUARE_RED);
      break;
    case constants.SQUARE_RED:
      this.markSquare(x,y, constants.SQUARE_EMPTY);
      break;
    default:
      this.markSquare(x,y, constants.SQUARE_GREEN);
      break;
    }
  }

}
