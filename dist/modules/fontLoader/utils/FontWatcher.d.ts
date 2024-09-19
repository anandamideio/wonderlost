import type { Font, LoadingMethod } from '../types';
export declare class FontWatcher {
    private font_;
    private load_;
    constructor(font: Font, load: LoadingMethod);
    private loading_;
    getFont(): Font;
    watch(): boolean;
}
//# sourceMappingURL=FontWatcher.d.ts.map