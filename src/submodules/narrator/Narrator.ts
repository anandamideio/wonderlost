import consola from 'consola';
import { Tome } from 'src/class/Tome';
import { FontsLoader } from 'src/modules/fontLoader/FontLoader';

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

export class Narrator extends Tome {
  public static fonts = [
    "Caslon",
    "CaslonAntique",
    "SignikaBold",
    "Riffic",
    "IronSans",
    "LinLibertine",
    "TimesNewRomance",
    "TimesNewYorker",
    "LPEducational",
    "Cardinal",
    "OldLondon",
    "StoneHenge",
    "SunnyDay",
    "PaulSignature",
    "LemonTuesday",
    "FairProsper",
    "BalletHarmony",
    "MagieraScript",
    "Cathallina",
    "Hamish",
    "DreamersBrush",
    "FastInMyCar",
    "ChildWriting",
    "Kindergarten",
    "FuturaHandwritten",
    "Fewriter",
    "TrashHand",
    "GoodBrush",
    "BaksoSapi",
    "SuplexmentaryComic",
    "ComicInk",
    "DreamyLand",
    "Yikes",
    "GangOfThree",
    "JianGkrik",
    "Yozakura",
    "Hiroshio",
    "ArabDances",
    "Rooters",
    "Subway",
    "Himagsikan",
    "MilTown",
    "Galactico",
    "Oko",
    "Ethnocentric",
    "VenusRising",
    "StampAct",
    "Kirsty",
    "Western",
    "BreakAway",
    "YoungerThanMe",
    "Underground",
    "VarsityTeam",
    "Valentino",
    "GlassHouses",
    "Makayla",
    "DancingVampyrish",
    "Codex",
    "DSNetStamped",
    "HappyFrushZero",
    "Shoplifter",
    "Stereofidelic",
    "Headache",
    "HorrorHouse",
    "GhostTheory2",
    "Syemox",
    "GhostChase"
  ] as const;
  public static fontWeights = [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ] as const;
  public static fontStyles = [
    "normal",
    "italic",
    "oblique"
  ] as const;

  public get titleFont() {
    return this.getSetting<typeof Narrator['fonts'][number]>("Title Font") ?? "GhostTheory2";
  }
  public static get titleFont() {
    return game.settings?.get('wonderlost', Tome.kabob('narrator-Title Font')) as typeof Narrator['fonts'][number]
      ?? "GhostTheory2" as typeof Narrator['fonts'][number];
  }
  public static set titleFont(value: typeof Narrator['fonts'][number]) {
    game.settings?.set('wonderlost', 'narrator-title-font', value);
  }

  public get textFont() {
    return this.getSetting<typeof Narrator['fonts'][number]>("Text Font") ?? "GhostTheory2";
  }
  public static get textFont() {
    return game.settings?.get('wonderlost', Tome.kabob('narrator-Text Font')) as typeof Narrator['fonts'][number]
      ?? "GhostTheory2";
  }
  public static set textFont(value: typeof Narrator['fonts'][number]) {
    game.settings?.set('wonderlost', 'narrator-text-font', value);
  }

  public get titleWeight() {
    return this.getSetting<typeof Narrator['fontWeights'][number]>("Title Weight") ?? "400";
  }
  public static get titleWeight() {
    return game.settings?.get('wonderlost', Tome.kabob('narrator-Title Weight')) as typeof Narrator['fontWeights'][number]
      ?? "400";
  }
  public static set titleWeight(value: typeof Narrator['fontWeights'][number]) {
    game.settings?.set('wonderlost', 'narrator-title-weight', value);
  }

  private canvas: HTMLCanvasElement;
  private stage: PIXI.Application;

  constructor(DEBUG = false) {
    super({
      moduleName: "Narrator",
      moduleDescription: "An extremely customizable on screen narrator system",
      // hooks: new Map([
      //   ['ready', async () => { await this.setup(); }],
      //   ['renderScene', async () => { if (this.ready) { this.render() } }]
      // ]),
      socketFns: new Map([]),
      DEBUG
    })

    this.registerSettings([
      {
        name: "Title Font",
        hint: "The font used for the title text",
        type: String,
        scope: 'world',

        restricted: false,
        defaultValue: "GhostTheory2",
        choices: Object.fromEntries(Narrator.fonts.map((font) => [font, font])),
      },
      {
        name: "Text Font",
        hint: "The font used for the text body",
        type: String,
        scope: 'world',

        restricted: false,
        defaultValue: "GhostTheory2",
        choices: Object.fromEntries(Narrator.fonts.map((font) => [font, font])),
      },
      {
        name: "Title Weight",
        hint: "The weight of the title font",
        type: String,
        scope: 'world',

        restricted: false,
        defaultValue: "400",
        choices: Object.fromEntries(Narrator.fontWeights.map((weight) => [weight, weight])),
      }
    ]);
  }

  private async setup(): Promise<void> {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.stage = new PIXI.Application({
      view: this.canvas,
      width: this.canvas.width,
      height: this.canvas.height,
      backgroundColor: 0x000000,
      resolution: devicePixelRatio || 1,
    });

    await this.loadFonts();
    this.ready = true;
  }

  private async loadFonts(): Promise<void> {
    const titleFont = this.getSetting<typeof Narrator['fonts'][number]>("Title Font") ?? "GhostTheory2";
    const textFont = this.getSetting<typeof Narrator['fonts'][number]>("Text Font") ?? "GhostTheory2";

    await FontsLoader({
      custom: {
        families: [titleFont, textFont],
      },
    });

    const otherFonts = Narrator.fonts.filter(font =>
      font !== titleFont && font !== textFont
    );

    await FontsLoader({
      custom: {
        families: otherFonts,
      },
    });
  }

  private render(): void {
    this.stage.render();
  }

  public async displayNarratorText(text: string, options: NarratorTextOptions = {}): Promise<void> {
    await this.showNarratorText(text, options);
  }

  private async showNarratorText(text: string, options: NarratorTextOptions = {}): Promise<void> {
    const {
      duration = 5000,
      fontSize = 48,
      fontColor = '#ffffff',
      backgroundColor = '#000000',
      opacity = 0.8
    } = options;

    const overlay = new PIXI.Graphics();
    overlay.beginFill(backgroundColor);
    overlay.drawRect(0, 0, this.canvas.width, this.canvas.height);
    overlay.endFill();
    overlay.alpha = opacity;
    this.stage.addChild(overlay);

    const textObject = new PIXI.Text(text, {
      fill: fontColor,
      fontSize: fontSize,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.canvas.width * 0.8,
    });
    textObject.anchor.set(0.5, 0.5);
    textObject.position.set(this.canvas.width / 2, this.canvas.height / 2);
    this.stage.addChild(textObject);

    const animationDuration = 1000;
    const animation = new PIXI.Animation(
      [
        { property: 'scale', from: 0.5, to: 1.2, easing: 'easeOut' },
        { property: 'alpha', from: 0, to: 1, easing: 'easeOut' },
      ],
      animationDuration
    );
    textObject.playAnimation(animation);

    await new Promise(resolve => setTimeout(resolve, animationDuration));
    await new Promise(resolve => setTimeout(resolve, duration - animationDuration));

    this.stage.removeChild(overlay);
    this.stage.removeChild(textObject);
  }
}
