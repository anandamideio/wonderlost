import consola from 'consola';
import { Toasted } from "./submodules/toasted/Toasted";

class Wonderlost {
  public tomes = new Map([
    ['Toasted', Toasted],
  ])

  constructor(public DEBUG = false) {
    consola.info("Wonderlost | Initializing");
    this.initializeTomes();
  }

  initializeTomes() {
    this.tomes.forEach((tome, tomeName) => {
      const t = new tome(this.DEBUG)
        .initializeSettings()
        .initializeHooks()
        .initializeSocketListeners();

      if (this.DEBUG) {
        consola.info(`Wonderlost | Initialized ${tome.name}`);
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

