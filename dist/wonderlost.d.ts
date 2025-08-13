import type { Tome } from './class/Tome';
import { Limbo } from './submodules/limbo/Limbo';
import { Narrator } from './submodules/narrator/Narrator';
import { SceneCreator } from './submodules/scenery/SceneCreator';
import { Toasted } from './submodules/toasted/Toasted';
declare class Wonderlost {
    DEBUG: boolean;
    modules: Map<"Scenery" | "Limbo" | "Narrator" | "Toasted", typeof SceneCreator | typeof Limbo | typeof Narrator | typeof Toasted>;
    moduleInstances: Map<string, Tome>;
    constructor(DEBUG?: boolean);
    initializeModules(): void;
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