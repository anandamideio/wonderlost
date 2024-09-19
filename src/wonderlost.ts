import consola from 'consola';
import { Toasted } from "./submodules/toasted/Toasted";
import { Narrator } from './submodules/narrator/Narrator';

type ToastedTuple = ['Toasted', typeof Toasted];
type NarratorTuple = ['Narrator', typeof Narrator];

class Wonderlost {
  public tomes = new Map<'Toasted' | 'Narrator', typeof Toasted | typeof Narrator>([
    ['Toasted', Toasted] as ToastedTuple,
    ['Narrator', Narrator] as NarratorTuple,
  ])

  constructor(public DEBUG = false) {
    this.DEBUG = DEBUG;
    consola.info("Wonderlost | Initialized", this);
  }

  initializeTomes() {
    for (const [tomeName, tome] of this.tomes) {
      new tome(this.DEBUG).initialize();

      if (this.DEBUG) {
        consola.info(`Wonderlost | Initialized ${tomeName}`, tome);
      }
    }
  }
}

Hooks.once("init", async function () {
  consola.start("Wonderlost | Initialized");
  new Wonderlost(true).initializeTomes();
  consola.success("Wonderlost | Ready");
});

// Hooks.once("ready", async function () { });

