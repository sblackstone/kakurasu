const STATE = Symbol();

export class GameModel {

  constructor(size) {
    this[STATE] = {
      size
    }
  }

}