import { Toasted } from "./submodules/toasted/Toasted";
import { Narrator } from './submodules/narrator/Narrator';
declare class Wonderlost {
    DEBUG: boolean;
    modules: Map<"Toasted" | "Narrator", typeof Toasted | typeof Narrator>;
    constructor(DEBUG?: boolean);
    initializeModules(): void;
    getModule(moduleName: 'Toasted' | 'Narrator'): typeof Toasted | typeof Narrator | undefined;
    moduleExists(moduleName: 'Toasted' | 'Narrator'): boolean;
    getAllModules(): Array<'Toasted' | 'Narrator'>;
    logAllModules(): void;
}
declare const wonderlost: Wonderlost;
export default wonderlost;
//# sourceMappingURL=wonderlost.d.ts.map