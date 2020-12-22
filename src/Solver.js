import { constants } from './constants';

export class Solver {
  constructor(gm) {
    this.size = gm.size;
    this.gm = gm;
  }
  
  solveFillSquare(i,j) {
      if (this.gm.getSquare(i,j) === constants.SQUARE_EMPTY) {
        const v = j+1;
        console.log(`Inspecting ${i},${j}`);
        if (v > this.gm.state.rows[i].greenNeeded) {
          console.log(`${v} is too big for ${i},${j} green, we need ${this.gm.state.rows[i].greenNeeded}`);
          this.gm.setSquare(i,j, constants.SQUARE_RED);
        } else if (v > this.gm.state.rows[i].redNeeded) {
          console.log(`${v} is too big for ${i},${j} red, we need ${this.gm.state.rows[i].redNeeded}`);
          this.gm.setSquare(i,j, constants.SQUARE_GREEN);
        }
      }
  }

  solveFillRow(i) {
    for (let j = 0; j < this.size; j++) {
      this.solveFillSquare(i,j);
    }
  }

  fillBoard() {
    for (let i = 0; i < this.size*2; i++) {
      this.solveFillRow(i);
    }
  }

  solve() {
    this.fillBoard();
  }

}