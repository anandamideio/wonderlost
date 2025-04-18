import { Narrator } from './submodules/narrator/Narrator';
import { Toasted } from './submodules/toasted/Toasted';
declare class Wonderlost {
    DEBUG: boolean;
    modules: Map<"Narrator" | "Toasted", typeof Narrator | typeof Toasted>;
    constructor(DEBUG?: boolean);
    initializeModules(): void;
    getModule(moduleName: 'Toasted' | 'Narrator'): typeof Narrator | typeof Toasted | undefined;
    moduleExists(moduleName: 'Toasted' | 'Narrator'): boolean;
    getAllModules(): Array<'Toasted' | 'Narrator'>;
    logAllModules(): void;
}
declare const wonderlost: Wonderlost;
export default wonderlost;
//# sourceMappingURL=wonderlost.d.ts.map