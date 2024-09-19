import { Tome } from 'src/class/Tome';

export class Narrator extends Tome {
  constructor(DEBUG = false) {
    super({
      moduleName: "Narrator",
      moduleDescription: "An extremely customizable on screen narrator system",
      hooks: new Map([]),
      socketFns: new Map([]),
      DEBUG
    })
  }
}
