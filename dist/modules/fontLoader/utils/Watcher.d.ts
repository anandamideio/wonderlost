import type { Font, LoadingMethod } from '../types';
export declare class Watcher {
    private fontWatchers_;
    private loadedFonts_;
    private watched_;
    add(font: Font, load: LoadingMethod): void;
    fontLoaded(fontName: string): void;
    watchFonts(): void;
}
//# sourceMappingURL=Watcher.d.ts.map