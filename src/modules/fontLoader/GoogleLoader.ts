import type { FontLoader, FontFamilies, Font, ParsedFont } from './types';
import { CssParser } from './utils/CSSParser';
import { FontParser } from './utils/FontParser';

export class GoogleFontApi {
  private apiUrl_ = 'https://fonts.googleapis.com/css';
  // TODO: implement google v2 api query
  // private apiUrlV2_ = 'https://fonts.googleapis.com/css2';
  private fonts_: string[];
  private version_: 1 | 2;

  /**
   * @param fonts
   * @param version
   */
  constructor(fonts: string[], version: 1 | 2 = 1) {
    this.fonts_ = fonts;
    this.version_ = version;
  }

  /**
   * Builds font googleapis url from given fonts in constructor
   * @return string
   */
  public buildUri(): string {
    const fontApiParser = new FontParser(this.fonts_);
    fontApiParser.parse();
    const request = fontApiParser.getFonts().map((font) => {
      const fontString = `${font.family}:${font.variation}`;
      return fontString.replace(/\s/g, '+');
    });
    const requestString: string = request.join('|');
    return `${this.apiUrl_}?family=${requestString}`;
  }
}

export class GoogleLoader implements FontLoader {
  private fonts_: FontFamilies;
  private uri_: string | undefined;

  constructor(fonts: FontFamilies) {
    this.fonts_ = fonts;
    this.generateUri_();
  }

  /**
   * Returns google uri to get all the fonts
   */
  public getUris(): string[] {
    return this.uri_ ? [this.uri_] : [];
  }

  /**
   * Return all google font's that should be loaded
   */
  public getFonts(): Font[] {
    const fontApiParser = new FontParser(this.fonts_.families);
    fontApiParser.parse();
    return fontApiParser.getFonts();
  }

  /**
   * Returns ParsedFont array for native font loading
   */
  public async getParsedFonts(): Promise<ParsedFont[]> {
    if (!this.uri_) {
      throw new Error('No uri provided. Nothing to parse.');
    }
    const fontResponse = await fetch(this.uri_).then((response) => response.text());
    const cssParser = new CssParser(fontResponse);
    cssParser.parseCSS();
    return cssParser.getParsedFonts();
  }

  /**
   * Generates google font api url from given array of fonts
   */
  private generateUri_(): void {
    const googleFontApi = new GoogleFontApi(this.fonts_.families);
    this.uri_ = googleFontApi.buildUri();
  }
}
