import consola from 'consola';
import { Toasted } from "./submodules/toasted/Toasted";
import { Narrator } from './submodules/narrator/Narrator';

class Wonderlost {
  public tomes = new Map([
    ['Toasted', Toasted],
    ['Narrator', Narrator],
  ])

  constructor(public DEBUG = false) {
    consola.info("Wonderlost | Initializing");
    this.initializeTomes();
  }

  initializeTomes() {
    this.tomes.forEach((tome, tomeName) => {
      new tome(this.DEBUG).initialize();

      if (this.DEBUG) {
        consola.info(`Wonderlost | Initialized ${tomeName}`);
      }
    })
  }
}

Hooks.once("init", async function () {
  consola.start("Wonderlost | Initialized");
  new Wonderlost(true);
  consola.success("Wonderlost | Ready");
});

Hooks.once("ready", async function () { });

