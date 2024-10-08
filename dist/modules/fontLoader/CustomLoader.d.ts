import type { FontLoader, Font, CustomFamilies, ParsedFont } from './types';
export declare class CustomLoader implements FontLoader {
    private readonly fonts_;
    private readonly uris_;
    constructor(config: CustomFamilies);
    /**
     * Returns parsed uris strings
     */
    getUris(): string[];
    /**
     * Return all font's that should be loaded
     */
    getFonts(): Font[];
    /**
     * Returns font object array
     */
    getParsedFonts(): ParsedFont[];
    /**
     * Parsing config to separate string and object families
     * @param families
     * @private
     */
    private parseFamilyConfig_;
}
//# sourceMappingURL=CustomLoader.d.ts.map