import type { Tome } from '@anandamideio/tome';
import { Limbo } from './submodules/limbo/Limbo';
import { SceneCreator } from './submodules/scenery/SceneCreator';
import { Toasted } from './submodules/toasted/Toasted';
declare class Wonderlost {
    DEBUG: boolean;
    modules: Map<"Scenery" | "Limbo" | "Toasted", typeof SceneCreator | typeof Limbo | typeof Toasted>;
    moduleInstances: Map<string, Tome>;
    constructor(DEBUG?: boolean);
    initializeModules(): Promise<void>;
    resolveDependencyOrder(): string[];
    getModule<T extends Tome = Tome>(moduleName: string): T | undefined;
    moduleExists(moduleName: string): boolean;
    getAllModules(): string[];
    logAllModules(): void;
    shutdownModules(): void;
}
declare const wonderlost: Wonderlost;
export default wonderlost;
//# sourceMappingURL=wonderlost.d.ts.map