/** Source: https://github.com/typekit/webfontloader/blob/master/src/modules/google/fontapiparser.js */
import type { Font } from '../types';
export declare class FontParser {
    private fontFamilies;
    private parsedFonts;
    private fontTestStrings;
    private INT_FONTS;
    private WEIGHTS;
    private STYLES;
    private VARIATION_MATCH;
    constructor(fontFamilies: string[]);
    parse(): void;
    private generateFontVariationDescription;
    private normalizeStyle;
    private normalizeWeight;
    private parseVariations;
    parseSubsets<T extends string = string>(subsets: T): T[];
    getFonts(): Font[];
    getFontTestStrings(): Record<string, string>;
}
//# sourceMappingURL=FontParser.d.ts.map