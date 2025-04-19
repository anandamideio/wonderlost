import consola from 'consola';
import { Narrator } from './submodules/narrator/Narrator';
import { Toasted } from './submodules/toasted/Toasted';

type ToastedTuple = ['Toasted', typeof Toasted];
type NarratorTuple = ['Narrator', typeof Narrator];

class Wonderlost {
  public modules = new Map<'Toasted' | 'Narrator', typeof Toasted | typeof Narrator>([
    ['Toasted', Toasted] as ToastedTuple,
    ['Narrator', Narrator] as NarratorTuple,
  ]);

  constructor(public DEBUG = false) {
    this.DEBUG = DEBUG;

    if (this.DEBUG) {
      consola.info('Wonderlost | Initialized', { self: this });
    }
  }

  initializeModules() {
    for (const [tomeName, Tome] of this.modules) {
      if (this.DEBUG) {
        consola.start(`Wonderlost | Initializing ${tomeName}`);
      }

      new Tome(this.DEBUG).initialize();

      if (this.DEBUG) {
        consola.info(`Wonderlost | Initialized ${tomeName}`, {
          Tome: Tome.prototype.toJSON(),
        });
      }
    }
  }

  getModule(moduleName: 'Toasted' | 'Narrator') {
    return this.modules.get(moduleName);
  }

  moduleExists(moduleName: 'Toasted' | 'Narrator'): boolean {
    return this.modules.has(moduleName);
  }

  getAllModules(): Array<'Toasted' | 'Narrator'> {
    return Array.from(this.modules.keys());
  }

  logAllModules() {
    const modules = this.getAllModules();
    consola.info('Wonderlost | Available Modules', { modules });
  }
}

const wonderlost = new Wonderlost(true);

Hooks.once("setup", () => {
  consola.start('Wonderlost | Setup started');
  wonderlost.initializeModules();
  wonderlost.logAllModules();
  consola.success('Wonderlost | Ready');

  // Make API available globally for other modules
  // @ts-ignore
  game.modules.get('wonderlost').api = wonderlost;
});

export default wonderlost;

