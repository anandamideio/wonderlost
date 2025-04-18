import { Toasted } from "./submodules/toasted/Toasted";
import { Narrator } from './submodules/narrator/Narrator';
declare class Wonderlost {
    DEBUG: boolean;
    tomes: Map<"Toasted" | "Narrator", typeof Toasted | typeof Narrator>;
    constructor(DEBUG?: boolean);
    initializeTomes(): void;
    getModule(moduleName: string): typeof Toasted | typeof Narrator | undefined;
    moduleExists(moduleName: string): boolean;
}
declare const wonderlost: Wonderlost;
export default wonderlost;
//# sourceMappingURL=wonderlost.d.ts.map