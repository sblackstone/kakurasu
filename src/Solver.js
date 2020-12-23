import { constants } from './constants';

const arrayIntersection = (arrays) => {
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

export class Solver {
  constructor(gm) {
    this.size = gm.size;
    this.gm = gm;
  }
  
  fillMinMaxSquare(i,j) {
      if (this.gm.getSquare(i,j) === constants.SQUARE_EMPTY) {
        const v = j+1;
        //console.log(`Inspecting ${i},${j}`);
        if (v > this.gm.state.rows[i].greenNeeded) {
          //console.log(`${v} is too big for ${i},${j} green, we need ${this.gm.state.rows[i].greenNeeded}`);
          this.gm.setSquare(i,j, constants.SQUARE_RED);
          return true;
        } else if (v > this.gm.state.rows[i].redNeeded) {
          //console.log(`${v} is too big for ${i},${j} red, we need ${this.gm.state.rows[i].redNeeded}`);
          this.gm.setSquare(i,j, constants.SQUARE_GREEN);
          return true;
        } else {
          return false;
        }
      }
      return false;
  }

  fillMinMaxRow(i) {
    const points = [];
    for (let j = 0; j < this.size; j++) {
      if (this.fillMinMaxSquare(i,j)) {
        points.push([i,j]);
      }
    }
    return points;
  }

  fillBoardMinMax() {
    let points = [];
    for (let i = 0; i < this.size*2; i++) {
      points = points.concat(this.fillMinMaxRow(i));
    }
    
    if (points.length > 0) {
      points = points.concat(this.fillBoardMinMax());
    }
    return points;

  }


  // needs to be checked... should be good?
  fillBoard2() {

    const params = {
      "green": constants.SQUARE_GREEN,
      "red": constants.SQUARE_RED
    };

    for (const [color,squareToken] of Object.entries(params)) {
      for (let i = 0; i < this.size*2; i++) {
        const data = this.waysToCompleteRow(i);
        if (data[color].length === 1) {
          for (let j = 0; j < data[color][0].length; j++) {
            this.gm.setSquare(i, data[color][0][j]-1, squareToken);
          }
        }
      }
    }
  }

  solve() {
    this.fillBoardMinMax();
    this.fillBoard2();
  }
  
  waysToCompleteRow(i, j=0, candidate = [], curSum=0, solutions = { red: [], green: []}) {
    if (curSum === this.gm.state.rows[i].greenNeeded) {
      solutions.green.push(candidate.slice(0));
    }
    if (curSum === this.gm.state.rows[i].redNeeded) {
      solutions.red.push(candidate.slice(0));
    }

    if (j === this.size) {
      return solutions;
    }

    if (this.gm.getSquare(i,j) === constants.SQUARE_EMPTY) {
      this.waysToCompleteRow(i, j+1, [...candidate, (j+1)], curSum+(j+1), solutions);
    }

    this.waysToCompleteRow(i, j+1, candidate, curSum, solutions);
    if (j === 0) {
      return solutions;
    }
  }
}

