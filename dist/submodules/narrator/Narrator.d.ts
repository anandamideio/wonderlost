import { Tome } from 'src/class/Tome';
/**
 * Options for the narrator text display
 */
interface NarratorTextOptions {
    /** Duration in milliseconds (default: 5000) */
    duration?: number;
    /** Font size in pixels (default: 48) */
    fontSize?: number;
    /** Text color in hex (default: '#ffffff') */
    fontColor?: string;
    /** Background color in hex (default: '#000000') */
    backgroundColor?: string;
    /** Background opacity 0-1 (default: 0.8) */
    opacity?: number;
    /** Font family to use (default: configured title font) */
    fontFamily?: string;
    /** Font weight (default: configured title weight) */
    fontWeight?: string;
    /** Font style (default: 'normal') */
    fontStyle?: 'normal' | 'italic' | 'oblique';
    /** Text alignment (default: 'center') */
    textAlign?: 'left' | 'center' | 'right';
    /** Word wrap width (default: 80% of canvas width) */
    wordWrapWidth?: number;
    /** Enable word wrapping (default: true) */
    wordWrap?: boolean;
    /** Animation options */
    animation?: {
        /** Animation duration in ms (default: 1000) */
        duration?: number;
        /** Animation easing (default: 'easeOutQuad') */
        easing?: string;
        /** Initial scale (default: 0.5) */
        initialScale?: number;
        /** Final scale (default: 1.2) */
        finalScale?: number;
        /** Initial opacity (default: 0) */
        initialAlpha?: number;
        /** Final opacity (default: 1) */
        finalAlpha?: number;
    };
}
/**
 * Narrator module for displaying cinematic text overlays
 */
export declare class Narrator extends Tome {
    static readonly FONTS: readonly ["Caslon", "CaslonAntique", "SignikaBold", "Riffic", "IronSans", "LinLibertine", "TimesNewRomance", "TimesNewYorker", "LPEducational", "Cardinal", "OldLondon", "StoneHenge", "SunnyDay", "PaulSignature", "LemonTuesday", "FairProsper", "BalletHarmony", "MagieraScript", "Cathallina", "Hamish", "DreamersBrush", "FastInMyCar", "ChildWriting", "Kindergarten", "FuturaHandwritten", "Fewriter", "TrashHand", "GoodBrush", "BaksoSapi", "SuplexmentaryComic", "ComicInk", "DreamyLand", "Yikes", "GangOfThree", "JianGkrik", "Yozakura", "Hiroshio", "ArabDances", "Rooters", "Subway", "Himagsikan", "MilTown", "Galactico", "Oko", "Ethnocentric", "VenusRising", "StampAct", "Kirsty", "Western", "BreakAway", "YoungerThanMe", "Underground", "VarsityTeam", "Valentino", "GlassHouses", "Makayla", "DancingVampyrish", "Codex", "DSNetStamped", "HappyFrushZero", "Shoplifter", "Stereofidelic", "Headache", "HorrorHouse", "GhostTheory2", "Syemox", "GhostChase"];
    static readonly FONT_WEIGHTS: readonly ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
    static readonly FONT_STYLES: readonly ["normal", "italic", "oblique"];
    private container;
    private fontsLoaded;
    constructor(debug?: boolean);
    /**
     * Get the configured title font
     */
    get titleFont(): typeof Narrator.FONTS[number];
    /**
     * Get the configured text font
     */
    get textFont(): typeof Narrator.FONTS[number];
    /**
     * Get the configured title weight
     */
    get titleWeight(): typeof Narrator.FONT_WEIGHTS[number];
    /**
     * Set up the narrator display system
     */
    private setup;
    /**
     * Load required fonts
     */
    private loadFonts;
    /**
     * Helper to load a set of fonts
     */
    private loadFontSet;
    /**
     * Display narrator text on screen
     */
    displayText(text: string, options?: NarratorTextOptions): Promise<void>;
    /**
     * Display a title with subtitle
     */
    displayTitle(title: string, subtitle?: string, options?: NarratorTextOptions): Promise<void>;
}
export {};
//# sourceMappingURL=Narrator.d.ts.map