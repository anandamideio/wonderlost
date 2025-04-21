import { Narrator } from './submodules/narrator/Narrator';
import { Toasted } from './submodules/toasted/Toasted';
import { SceneCreator } from './submodules/scenery/SceneCreator';
declare class Wonderlost {
    DEBUG: boolean;
    modules: Map<"Narrator" | "Toasted" | "Scenery", typeof Narrator | typeof Toasted | typeof SceneCreator>;
    constructor(DEBUG?: boolean);
    initializeModules(): void;
    getModule(moduleName: 'Toasted' | 'Narrator' | 'Scenery'): typeof Toasted | typeof Narrator | typeof SceneCreator | undefined;
    moduleExists(moduleName: 'Toasted' | 'Narrator' | 'Scenery'): boolean;
    getAllModules(): Array<'Toasted' | 'Narrator' | 'Scenery'>;
    logAllModules(): void;
}
declare const wonderlost: Wonderlost;
export default wonderlost;
//# sourceMappingURL=wonderlost.d.ts.map