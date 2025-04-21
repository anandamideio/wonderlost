import consola from 'consola';
import { Narrator } from './submodules/narrator/Narrator';
import { Toasted } from './submodules/toasted/Toasted';
import { SceneCreator } from './submodules/scenery/SceneCreator';

type ToastedTuple = ['Toasted', typeof Toasted];
type NarratorTuple = ['Narrator', typeof Narrator];
type SceneryTuple = ['Scenery', typeof SceneCreator];

class Wonderlost {
  public modules = new Map<'Toasted' | 'Narrator' | 'Scenery', typeof Toasted | typeof Narrator | typeof SceneCreator>([
    ['Toasted', Toasted] as ToastedTuple,
    ['Narrator', Narrator] as NarratorTuple,
    ['Scenery', SceneCreator] as SceneryTuple,
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

      const module = new Tome(this.DEBUG);

      module.initialize();

      if (this.DEBUG) {
        consola.info(`Wonderlost | Initialized ${tomeName}`, {
          Tome: module.toJSON(),
        });
      }
    }
  }

  getModule(
    moduleName: 'Toasted' | 'Narrator' | 'Scenery',
  ): typeof Toasted | typeof Narrator | typeof SceneCreator | undefined {
    return this.modules.get(moduleName);
  }

  moduleExists(moduleName: 'Toasted' | 'Narrator' | 'Scenery'): boolean {
    return this.modules.has(moduleName);
  }

  getAllModules(): Array<'Toasted' | 'Narrator' | 'Scenery'> {
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

