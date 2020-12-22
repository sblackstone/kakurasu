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

  fillBoard() {
    let points = [];
    for (let i = 0; i < this.size*2; i++) {
      points = points.concat(this.solveFillRow(i));
    }
    
    if (points.length > 0) {
      return points.concat(this.fillBoard());
    } else {
      return points;
    }
  }

  solve() {
    this.fillBoard();
  }

}