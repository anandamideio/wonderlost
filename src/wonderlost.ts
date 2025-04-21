import consola from 'consola';
import { Narrator } from './submodules/narrator/Narrator';
import { Toasted } from './submodules/toasted/Toasted';
import { SceneCreator } from './submodules/scenery/SceneCreator';
import type { Tome } from './class/Tome';
import { Limbo } from './submodules/limbo/Limbo';

type ToastedTuple = ['Toasted', typeof Toasted];
type NarratorTuple = ['Narrator', typeof Narrator];
type SceneryTuple = ['Scenery', typeof SceneCreator];
type LimboTuple = ['Limbo', typeof Limbo];

class Wonderlost {
  public modules = new Map<
    'Toasted' | 'Narrator' | 'Scenery' | 'Limbo',
    typeof Toasted | typeof Narrator | typeof SceneCreator | typeof Limbo
  >([
    ['Toasted', Toasted] as ToastedTuple,
    ['Narrator', Narrator] as NarratorTuple,
    ['Scenery', SceneCreator] as SceneryTuple,
    ['Limbo', Limbo] as LimboTuple,
  ]);

  public moduleInstances = new Map<string, Tome>();

  constructor(public DEBUG = false) {
    this.DEBUG = DEBUG;

    if (this.DEBUG) {
      consola.info('Wonderlost | Initialized', { self: this });
    }
  }

  initializeModules() {
    // First, create all module instances
    for (const [tomeName, TomeClass] of this.modules) {
      if (this.DEBUG) {
        consola.start(`Wonderlost | Creating instance of ${tomeName}`);
      }

      const module = new TomeClass(this.DEBUG);
      this.moduleInstances.set(tomeName, module);
    }

    // Next, resolve dependency order
    const initOrder = this.resolveDependencyOrder();

    if (this.DEBUG) {
      consola.info(`Wonderlost | Initialization order: ${initOrder.join(', ')}`);
    }

    // Initialize modules in the correct order
    for (const tomeName of initOrder) {
      if (this.DEBUG) {
        consola.start(`Wonderlost | Initializing ${tomeName}`);
      }

      const module = this.moduleInstances.get(tomeName);

      if (!module) {
        consola.error(`Wonderlost | Module ${tomeName} not found`);
        continue;
      }

      module.initialize();

      if (this.DEBUG) {
        consola.info(`Wonderlost | Initialized ${tomeName}`);
      }
    }
  }

  resolveDependencyOrder(): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (tomeName: string) => {
      if (visited.has(tomeName)) return;

      visited.add(tomeName);

      const instance = this.moduleInstances.get(tomeName);
      if (!instance) return;

      // Visit dependencies first
      for (const depName of instance.dependencies) {
        visit(depName);
      }

      result.push(tomeName);
    };

    // Visit all modules
    for (const tomeName of this.moduleInstances.keys()) {
      visit(tomeName);
    }

    return result;
  }

  getModule<T extends Tome = Tome>(moduleName: string): T | undefined {
    return this.moduleInstances.get(moduleName) as T | undefined;
  }

  moduleExists(moduleName: string): boolean {
    return this.moduleInstances.has(moduleName);
  }

  getAllModules(): string[] {
    return Array.from(this.moduleInstances.keys());
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

