import { constants } from './constants';

const TARGET_BOARD_FILL_RATIO = 0.70;


export class GameModel {
  constructor(size, solverDebugFn) {
    this.size = size;
    this.solverDebugFn = solverDebugFn;
    this.initState();
  }

  initStats() {
    this.state.rows = [];
  
    const greenRowSums = this.rowSums("playerBoard", constants.SQUARE_GREEN); 
    const redRowSums   = this.rowSums("playerBoard", constants.SQUARE_RED); 

    const targetGreenRowSums = this.rowSums("targetBoard", constants.SQUARE_GREEN); 
    const targetRedRowSums   = this.rowSums("targetBoard", constants.SQUARE_RED); 


    for (let i = 0; i < this.size*2; i++) {
      this.state.rows[i] = {
        greenSum:        greenRowSums[i],
        redSum:          redRowSums[i],
        targetGreenSum:  targetGreenRowSums[i],
        targetRedSum:    targetRedRowSums[i],
        greenNeeded:     targetGreenRowSums[i],
        redNeeded:       targetRedRowSums[i]
      };      
    }

  }
  

async initState() {
    this.state = {
      size: this.size,
      sigma: ((this.size) * (this.size + 1)) / 2,
    };
    this.initPlayerBoard();
    this.initTargetBoard(); 
    this.initStats();
  }

  async debugDraw() {
    this.solverDebugFn(this);
    return new Promise((resolve,reject)=> {
      setTimeout(()=> { resolve(); }, 5);
    });

  }

  getTargetSquare(x,y) {
    return this.state.targetBoard[x][y].N;
  }

  getSquare(x,y) {
    return this.state.playerBoard[x][y].N;
  }

  initTargetBoardFake() {
    this.state.targetBoard = this.createBlankBoard();
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        this.state.targetBoard[i][j].N = 2;
      }
    }
    this.state.targetBoard[2][2].N = 1;
  }

  initTargetBoard() {
    //return this.initTargetBoardFake();
    this.state.targetBoard = this.createBlankBoard();
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        const fillVal = (Math.random() > (1 - TARGET_BOARD_FILL_RATIO)) ? constants.SQUARE_GREEN : constants.SQUARE_RED;
        this.state.targetBoard[i][j].N = fillVal;
      }
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
      rows: this.state.rows.map(x => Object.assign({}, x)),
      wonGame: this.checkWin()
    };

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
    return this.state.rows.every(x => (x.greenNeeded == 0 && x.redNeeded == 0));
  }

  setSquare(x,y,val) {
    if (x >= this.size) {
      //console.log(`Mapping (${x},${y}) to (${y},${x-this.size}) = ${val}`);
      return this.setSquare(y, x - this.size, val);
    }

    //console.log(`Setting (${x},${y}) = ${val}`);
    switch(this.getSquare(x,y)) {
    case constants.SQUARE_GREEN:
      this.state.rows[x].greenSum                  -= (y+1);
      this.state.rows[x].greenNeeded               += (y+1);
      this.state.rows[y+this.size].greenSum        -= (x+1);
      this.state.rows[y+this.size].greenNeeded     += (x+1);
      break;
    case constants.SQUARE_RED:
      this.state.rows[x].redSum                    -= (y+1);
      this.state.rows[x].redNeeded                 += (y+1);
      this.state.rows[y+this.size].redSum          -= (x+1);
      this.state.rows[y+this.size].redNeeded       += (x+1);
      break;
    default:
      break;
    }

    // Put in the new piece!
    switch(val) {
    case constants.SQUARE_GREEN:
      this.state.rows[x].greenSum                 += (y+1);
      this.state.rows[x].greenNeeded              -= (y+1);
      this.state.rows[y+this.size].greenSum       += (x+1);
      this.state.rows[y+this.size].greenNeeded    -= (x+1);
      break;
    case constants.SQUARE_RED:
      this.state.rows[x].redSum                   += (y+1);
      this.state.rows[x].redNeeded                -= (y+1);
      this.state.rows[y+this.size].redSum         += (x+1);
      this.state.rows[y+this.size].redNeeded      -= (x+1);
      break;
    default:
      break;
    }



    this.state.playerBoard[x][y].N = val;
    //console.log('needed');
    //this.state.rows.forEach((x,i) => console.log([i, x.greenNeeded, x.redNeeded]))
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
