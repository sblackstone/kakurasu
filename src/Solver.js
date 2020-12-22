import { constants } from './constants';

export class Solver {
  constructor(gm) {
    this.size = gm.size;
    this.gm = gm;
  }
  
  solveFillSquare(i,j) {
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

  solveFillRow(i) {
    const points = [];
    for (let j = 0; j < this.size; j++) {
      if (this.solveFillSquare(i,j)) {
        points.push([i,j]);
      }
    }
    return points;
  }

  fillBoardMinMax() {
    let points = [];
    for (let i = 0; i < this.size*2; i++) {
      points = points.concat(this.solveFillRow(i));
    }
    
    if (points.length > 0) {
      return points.concat(this.fillBoardMinMax());
    } else {
      return points;
    }
  }

  solve() {
    this.fillBoardMinMax();
  }
  
  waysToCompleteRow(i, j=0, candidate = [], curSum=0, solutions = { red: [], green: []}) {

    let solved = false;
    if (curSum === this.gm.state.rows[i].greenNeeded) {
      solutions.green.push(candidate.slice(0));
      solved = true;
    }
    if (curSum === this.gm.state.rows[i].redNeeded) {
      solutions.red.push(candidate.slice(0));
      solved = true;
    }

    if (solved || j === this.size) {
      return;
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


/*

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

*/