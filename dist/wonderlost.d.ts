import { Narrator } from './submodules/narrator/Narrator';
import { Toasted } from './submodules/toasted/Toasted';
import { SceneCreator } from './submodules/scenery/SceneCreator';
import type { Tome } from './class/Tome';
import { Limbo } from './submodules/limbo/Limbo';
declare class Wonderlost {
    DEBUG: boolean;
    modules: Map<"Narrator" | "Toasted" | "Limbo" | "Scenery", typeof Narrator | typeof Toasted | typeof SceneCreator | typeof Limbo>;
    moduleInstances: Map<string, Tome>;
    constructor(DEBUG?: boolean);
    initializeModules(): void;
    resolveDependencyOrder(): string[];
    getModule<T extends Tome = Tome>(moduleName: string): T | undefined;
    moduleExists(moduleName: string): boolean;
    getAllModules(): string[];
    logAllModules(): void;
}
declare const wonderlost: Wonderlost;
export default wonderlost;
//# sourceMappingURL=wonderlost.d.ts.map