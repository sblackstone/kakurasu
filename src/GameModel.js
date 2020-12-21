import { constants } from './constants';

const TARGET_BOARD_FILL_RATIO = 0.60;


export class GameModel {
  constructor(size, solverDebugFn) {
    this.size = size;
    this.solverDebugFn = solverDebugFn;
    this.initState();
  }


  async initState() {
    this.state = {
      size: this.size,
      sigma: ((this.size) * (this.size + 1)) / 2,
    };
    this.initPlayerBoard();
    this.initTargetBoard(); 

  }

  async debugDraw() {
    this.solverDebugFn(this);
    return new Promise((resolve,reject)=> {
      setTimeout(()=> { resolve(); }, 5);
    });

  }

  getSquare(x,y) {
    return this.state.playerBoard[x][y].N;
  }

  initTargetBoard() {
    this.state.targetBoard = this.createBlankBoard();
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        const fillVal = (Math.random() > (1 - TARGET_BOARD_FILL_RATIO)) ? constants.SQUARE_GREEN : constants.SQUARE_RED;
        this.state.targetBoard[i][j].N = fillVal;
      }
      this.state.targetBoard.push(row);
    }
  }

  markAllPoints(points, newValue) {
    for (let i = 0; i < points.length; i++) {
      this.setSquare(points[i][0], points[i][1], newValue);
    }
  }

  initPlayerBoard() {
    this.state.playerBoard = this.createBlankBoard();
  }

  // We make the board an array of nxn objects
  // We then create cols as if they were additional rows
  createBlankBoard() {
    const result = [];
    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        row.push({N: constants.SQUARE_EMPTY});
      }
      result.push(row);
    }

    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(result[j][i]);
      }
      result.push(row);
    }

    return result;

  }

  rowSums(boardName, targetChar) {
    let result = [];
    for (let i = 0; i < this.size*2; i++) {
      let sum = 0;
      for (let j = 0; j < this.size; j++) {
        if (this.state[boardName][i][j].N === targetChar) {
          sum += (j+1);
        }
      }
      result.push(sum);
    };
    return result;
  }

  export() {
    let result = {
      sigma: this.state.sigma,
      size: this.state.size,
      playerBoard: this.state.playerBoard.map(x => x.map(y => y.N)),
      wonGame: this.checkWin()
    };

    // Make the view work for now...
    ["rowNeeded", "colNeeded", "antiRowNeeded", "antiColNeeded"].forEach(x => {
        result[x] = Array(15).fill(0);
    })

    return result;

  }

  debug(boardName="playerBoard") {
    for (let i = 0; i < this.size*2; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(this.state[boardName][i][j].N);
      }
      console.log(row);
    }
  }

  checkWin() {
    return false;
  }

  setSquare(x,y,val) {
    this.state.playerBoard[x][y].N = val;
  }

  toggleSquare(x,y) {
    switch(this.getSquare(x,y)) {
    case constants.SQUARE_GREEN:
      this.setSquare(x,y, constants.SQUARE_RED);
      break;
    case constants.SQUARE_RED:
      this.setSquare(x,y, constants.SQUARE_EMPTY);
      break;
    default:
      this.setSquare(x,y, constants.SQUARE_GREEN);
      break;
    }
  }

}
