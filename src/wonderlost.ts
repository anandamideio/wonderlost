import consola from 'consola';
import type { Tome } from '@anandamideio/tome';
import { Limbo } from './submodules/limbo/Limbo';
import { SceneCreator } from './submodules/scenery/SceneCreator';
import { Toasted } from './submodules/toasted/Toasted';

type ToastedTuple = ['Toasted', typeof Toasted];
type SceneryTuple = ['Scenery', typeof SceneCreator];
type LimboTuple = ['Limbo', typeof Limbo];

class Wonderlost {
  public modules = new Map<
    'Toasted' | 'Scenery' | 'Limbo',
    typeof Toasted | typeof SceneCreator | typeof Limbo
  >([
    ['Toasted', Toasted] as ToastedTuple,
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

  async initializeModules() {
    // First, create all module instances
    for (const [tomeName, TomeClass] of this.modules) {
      if (this.DEBUG) {
        consola.info(`Wonderlost | Creating module: ${tomeName}`);
      }

      const module = new TomeClass(this.DEBUG);
      this.moduleInstances.set(tomeName, module);
    }

    // Next, resolve dependency order
    const initOrder = this.resolveDependencyOrder();

    if (this.DEBUG) {
      consola.info(`Wonderlost | Initialization order: ${initOrder.join(', ')}`);
    }

    // Initialize modules in the correct order (now async!)
    for (const tomeName of initOrder) {
      if (this.DEBUG) {
        consola.start(`Wonderlost | Initializing: ${tomeName}`);
      }

      const module = this.moduleInstances.get(tomeName);

      if (!module) {
        consola.error(`Wonderlost | Module not found: ${tomeName}`);
        continue;
      }

      // Use await since initialize is now async
      await module.initialize();

      if (this.DEBUG) {
        consola.success(`Wonderlost | Initialized: ${tomeName}`);
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

  public shutdownModules(): void {
    if (this.DEBUG) {
      consola.start('Wonderlost | Shutting down modules');
    }

    // Get modules in reverse initialization order to properly handle dependencies
    const shutdownOrder = this.resolveDependencyOrder().reverse();

    for (const tomeName of shutdownOrder) {
      if (this.DEBUG) {
        consola.info(`Wonderlost | Shutting down ${tomeName}`);
      }

      const module = this.moduleInstances.get(tomeName);
      if (!module) continue;

      // Call destroy to clean up resources
      if (typeof module.destroy === 'function') {
        module.destroy();
      }
    }

    // Clear all module instances
    this.moduleInstances.clear();
  }
}

const wonderlost = new Wonderlost(true);

Hooks.once('setup', async () => {
  consola.start('Wonderlost | Setup started');
  await wonderlost.initializeModules();
  wonderlost.logAllModules();
  consola.success('Wonderlost | Ready');

  // Make API available globally for other modules
  const wonderlostModule = game.modules?.get('wonderlost');
  if (wonderlostModule) {
    // biome-ignore lint/suspicious/noExplicitAny: Foundry API requires any
    (wonderlostModule as any).api = wonderlost;
  }

  window.addEventListener('beforeunload', () => {
    wonderlost.shutdownModules();
  });
});

export default wonderlost;
