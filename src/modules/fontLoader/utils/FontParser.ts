/** Source: https://github.com/typekit/webfontloader/blob/master/src/modules/google/fontapiparser.js */

import type { Font } from '../types';


export class FontParser {
  private fontFamilies: string[];
  private parsedFonts: Font[];
  private fontTestStrings: Record<string, string>;

  private INT_FONTS = {
    latin: 'BESbswy',
    'latin-ext': '\u00E7\u00F6\u00FC\u011F\u015F',
    cyrillic: '\u0439\u044f\u0416',
    greek: '\u03b1\u03b2\u03a3',
    khmer: '\u1780\u1781\u1782',
    Hanuman: '\u1780\u1781\u1782', // For backward compatibility
  };
  private WEIGHTS = {
    thin: '1',
    extralight: '2',
    'extra-light': '2',
    ultralight: '2',
    'ultra-light': '2',
    light: '3',
    regular: '4',
    book: '4',
    medium: '5',
    'semi-bold': '6',
    semibold: '6',
    'demi-bold': '6',
    demibold: '6',
    bold: '7',
    'extra-bold': '8',
    extrabold: '8',
    'ultra-bold': '8',
    ultrabold: '8',
    black: '9',
    heavy: '9',
    l: '3',
    r: '4',
    b: '7',
  };
  private STYLES = {
    i: 'i',
    italic: 'i',
    n: 'n',
    normal: 'n',
  };
  private VARIATION_MATCH = new RegExp(
    '^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|' +
    '(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i' +
    '|normal|italic)?$'
  );

  constructor(fontFamilies: string[]) {
    this.fontFamilies = fontFamilies;
    this.parsedFonts = [];
    this.fontTestStrings = {};
  }

  public parse(): void {
    for (const fontFamilyString of this.fontFamilies) {
      const elements = fontFamilyString.split(':');
      const fontFamily = elements[0].replace(/\+/g, ' ');
      let variations = ['n4'];

      if (elements.length >= 2) {
        const fvds = this.parseVariations(elements[1]);
        if (fvds.length > 0) {
          variations = fvds;
        }
        if (elements.length === 3) {
          const subsets = this.parseSubsets(elements[2]);
          if (subsets.length > 0) {
            const fontTestString = this.INT_FONTS[subsets[0] as keyof typeof this.INT_FONTS];
            if (fontTestString) {
              this.fontTestStrings[fontFamily] = fontTestString;
            }
          }
        }
      }

      // For backward compatibility
      if (!this.fontTestStrings[fontFamily]) {
        const hanumanTestString = this.INT_FONTS[fontFamily as keyof typeof this.INT_FONTS];
        if (hanumanTestString) {
          this.fontTestStrings[fontFamily] = hanumanTestString;
        }
      }

      for (const variation of variations) {
        this.parsedFonts.push({
          family: fontFamily,
          variation,
        });
      }
    }
  }

  private generateFontVariationDescription(variation: string) {
    if (!variation.match(/^[\w-]+$/)) {
      return '';
    }
    const normalizedVariation = variation.toLowerCase();
    const groups = this.VARIATION_MATCH.exec(normalizedVariation);
    if (groups == null) {
      return '';
    }
    const styleMatch = this.normalizeStyle(groups[2] as keyof typeof this.STYLES);
    const weightMatch = this.normalizeWeight(groups[1] as keyof typeof this.WEIGHTS);
    return [styleMatch, weightMatch].join('');
  }

  private normalizeStyle(parsedStyle: keyof typeof this.STYLES | '' | null) {
    if (parsedStyle == null || parsedStyle == '') {
      return 'n';
    }
    return this.STYLES[parsedStyle];
  }

  private normalizeWeight(parsedWeight?: keyof typeof this.WEIGHTS | '' | number) {
    if (parsedWeight == null || parsedWeight == '') {
      return '4';
    }
    if (typeof parsedWeight === 'string') {
      const weight = this.WEIGHTS[parsedWeight];
      if (weight) {
        return weight;
      }
    }
    if (typeof parsedWeight === 'number') {
      if (isNaN(parsedWeight)) {
        return '4';
      }

    }
    return parsedWeight.toString().substr(0, 1);
  }

  private parseVariations(variations: string) {
    const finalVariations: string[] = [];

    if (!variations) {
      return finalVariations;
    }
    const providedVariations = variations.split(',');
    const length = providedVariations.length;

    for (let i = 0; i < length; i++) {
      const variation = providedVariations[i];
      const fvd = this.generateFontVariationDescription(variation);

      if (fvd) {
        finalVariations.push(fvd);
      }
    }
    return finalVariations;
  }

  public parseSubsets<T extends string = string>(subsets: T): T[] {
    const finalSubsets: T[] = [];

    if (!subsets) {
      return finalSubsets;
    }
    return subsets.split(',') as T[];
  }

  public getFonts() {
    return this.parsedFonts;
  }

  public getFontTestStrings() {
    return this.fontTestStrings;
  }
}
