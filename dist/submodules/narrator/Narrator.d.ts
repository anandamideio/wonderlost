import { Tome } from 'src/class/Tome';
interface NarratorTextOptions {
    /**
     * The total duration the narrator text should be displayed in milliseconds.
     * Default: 5000 (5 seconds)
     */
    duration?: number;
    /**
     * The font size of the text.
     * Default: 48
     */
    fontSize?: number;
    /**
     * The color of the text in hexadecimal format.
     * Default: '#ffffff' (white)
     */
    fontColor?: string;
    /**
     * The background color of the overlay in hexadecimal format.
     * Default: '#000000' (black)
     */
    backgroundColor?: string;
    /**
     * The opacity of the overlay (0 to 1).
     * Default: 0.8
     */
    opacity?: number;
    /**
     * The font family to use for the text.
     * Default: The first font in Narrator.fonts
     */
    fontFamily?: string;
    /**
     * The font weight to use for the text.
     * Default: '400'
     */
    fontWeight?: string;
    /**
     * The font style to use for the text.
     * Default: 'normal'
     */
    fontStyle?: 'normal' | 'italic' | 'oblique';
    /**
     * The alignment of the text.
     * Default: 'center'
     */
    textAlign?: 'left' | 'center' | 'right';
    /**
     * The maximum width for word wrapping.
     * Default: canvas.width * 0.8
     */
    wordWrapWidth?: number;
    /**
     * Whether to enable word wrapping.
     * Default: true
     */
    wordWrap?: boolean;
    /**
     * Custom animation options for the text appearance.
     */
    animation?: {
        /**
         * The duration of the animation in milliseconds.
         * Default: 1000 (1 second)
         */
        duration?: number;
        /**
         * The easing function for the animation.
         * Default: 'easeOut'
         */
        easing?: string;
        /**
         * The initial scale of the text.
         * Default: 0.5
         */
        initialScale?: number;
        /**
         * The final scale of the text.
         * Default: 1.2
         */
        finalScale?: number;
        /**
         * The initial alpha of the text.
         * Default: 0
         */
        initialAlpha?: number;
        /**
         * The final alpha of the text.
         * Default: 1
         */
        finalAlpha?: number;
    };
}
export declare class Narrator extends Tome {
    static fonts: readonly ["Caslon", "CaslonAntique", "SignikaBold", "Riffic", "IronSans", "LinLibertine", "TimesNewRomance", "TimesNewYorker", "LPEducational", "Cardinal", "OldLondon", "StoneHenge", "SunnyDay", "PaulSignature", "LemonTuesday", "FairProsper", "BalletHarmony", "MagieraScript", "Cathallina", "Hamish", "DreamersBrush", "FastInMyCar", "ChildWriting", "Kindergarten", "FuturaHandwritten", "Fewriter", "TrashHand", "GoodBrush", "BaksoSapi", "SuplexmentaryComic", "ComicInk", "DreamyLand", "Yikes", "GangOfThree", "JianGkrik", "Yozakura", "Hiroshio", "ArabDances", "Rooters", "Subway", "Himagsikan", "MilTown", "Galactico", "Oko", "Ethnocentric", "VenusRising", "StampAct", "Kirsty", "Western", "BreakAway", "YoungerThanMe", "Underground", "VarsityTeam", "Valentino", "GlassHouses", "Makayla", "DancingVampyrish", "Codex", "DSNetStamped", "HappyFrushZero", "Shoplifter", "Stereofidelic", "Headache", "HorrorHouse", "GhostTheory2", "Syemox", "GhostChase"];
    static fontWeights: readonly ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
    static fontStyles: readonly ["normal", "italic", "oblique"];
    get titleFont(): "Caslon" | "CaslonAntique" | "SignikaBold" | "Riffic" | "IronSans" | "LinLibertine" | "TimesNewRomance" | "TimesNewYorker" | "LPEducational" | "Cardinal" | "OldLondon" | "StoneHenge" | "SunnyDay" | "PaulSignature" | "LemonTuesday" | "FairProsper" | "BalletHarmony" | "MagieraScript" | "Cathallina" | "Hamish" | "DreamersBrush" | "FastInMyCar" | "ChildWriting" | "Kindergarten" | "FuturaHandwritten" | "Fewriter" | "TrashHand" | "GoodBrush" | "BaksoSapi" | "SuplexmentaryComic" | "ComicInk" | "DreamyLand" | "Yikes" | "GangOfThree" | "JianGkrik" | "Yozakura" | "Hiroshio" | "ArabDances" | "Rooters" | "Subway" | "Himagsikan" | "MilTown" | "Galactico" | "Oko" | "Ethnocentric" | "VenusRising" | "StampAct" | "Kirsty" | "Western" | "BreakAway" | "YoungerThanMe" | "Underground" | "VarsityTeam" | "Valentino" | "GlassHouses" | "Makayla" | "DancingVampyrish" | "Codex" | "DSNetStamped" | "HappyFrushZero" | "Shoplifter" | "Stereofidelic" | "Headache" | "HorrorHouse" | "GhostTheory2" | "Syemox" | "GhostChase";
    static get titleFont(): typeof Narrator['fonts'][number];
    static set titleFont(value: typeof Narrator['fonts'][number]);
    get textFont(): "Caslon" | "CaslonAntique" | "SignikaBold" | "Riffic" | "IronSans" | "LinLibertine" | "TimesNewRomance" | "TimesNewYorker" | "LPEducational" | "Cardinal" | "OldLondon" | "StoneHenge" | "SunnyDay" | "PaulSignature" | "LemonTuesday" | "FairProsper" | "BalletHarmony" | "MagieraScript" | "Cathallina" | "Hamish" | "DreamersBrush" | "FastInMyCar" | "ChildWriting" | "Kindergarten" | "FuturaHandwritten" | "Fewriter" | "TrashHand" | "GoodBrush" | "BaksoSapi" | "SuplexmentaryComic" | "ComicInk" | "DreamyLand" | "Yikes" | "GangOfThree" | "JianGkrik" | "Yozakura" | "Hiroshio" | "ArabDances" | "Rooters" | "Subway" | "Himagsikan" | "MilTown" | "Galactico" | "Oko" | "Ethnocentric" | "VenusRising" | "StampAct" | "Kirsty" | "Western" | "BreakAway" | "YoungerThanMe" | "Underground" | "VarsityTeam" | "Valentino" | "GlassHouses" | "Makayla" | "DancingVampyrish" | "Codex" | "DSNetStamped" | "HappyFrushZero" | "Shoplifter" | "Stereofidelic" | "Headache" | "HorrorHouse" | "GhostTheory2" | "Syemox" | "GhostChase";
    static get textFont(): typeof Narrator['fonts'][number];
    static set textFont(value: typeof Narrator['fonts'][number]);
    get titleWeight(): "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    static get titleWeight(): typeof Narrator['fontWeights'][number];
    static set titleWeight(value: typeof Narrator['fontWeights'][number]);
    private canvas;
    private stage;
    constructor(DEBUG?: boolean);
    private setup;
    private loadFonts;
    private render;
    displayNarratorText(text: string, options?: NarratorTextOptions): Promise<void>;
    private showNarratorText;
}
export {};
//# sourceMappingURL=Narrator.d.ts.map