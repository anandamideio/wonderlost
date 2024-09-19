import consola from 'consola';
import { Toasted } from "./submodules/toasted/Toasted";
import { Narrator } from './submodules/narrator/Narrator';

type ToastedTuple = ['Toasted', Toasted];
type NarratorTuple = ['Narrator', Narrator];

class Wonderlost {
  public tomes = new Map<'Toasted' | 'Narrator', Toasted | Narrator>([
    ['Toasted', new Toasted()] as ToastedTuple,
    ['Narrator', new Narrator()] as NarratorTuple,
  ])

  constructor(public DEBUG = false) {
    consola.info("Wonderlost | Initialized", this);
  }

  initializeTomes() {
    for (const [tomeName, tome] of this.tomes) {
      tome.initialize();

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

Hooks.once("ready", async function () { });

