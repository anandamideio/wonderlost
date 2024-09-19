import type { FontLoader, FontFamilies, Font, ParsedFont } from './types';
export declare class GoogleFontApi {
    private apiUrl_;
    private fonts_;
    private version_;
    /**
     * @param fonts
     * @param version
     */
    constructor(fonts: string[], version?: 1 | 2);
    /**
     * Builds font googleapis url from given fonts in constructor
     * @return string
     */
    buildUri(): string;
}
export declare class GoogleLoader implements FontLoader {
    private fonts_;
    private uri_;
    constructor(fonts: FontFamilies);
    /**
     * Returns google uri to get all the fonts
     */
    getUris(): string[];
    /**
     * Return all google font's that should be loaded
     */
    getFonts(): Font[];
    /**
     * Returns ParsedFont array for native font loading
     */
    getParsedFonts(): Promise<ParsedFont[]>;
    /**
     * Generates google font api url from given array of fonts
     */
    private generateUri_;
}
//# sourceMappingURL=GoogleLoader.d.ts.map