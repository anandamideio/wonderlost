import consola from 'consola';
import { Tome } from 'src/class/Tome';
import { FontsLoader } from 'src/modules/fontLoader/FontLoader';

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
    return game.settings?.get('wonderlost', 'narrator-title-font') as typeof Narrator['fonts'][number]
      ?? "GhostTheory2" as typeof Narrator['fonts'][number];
  }
  public static set titleFont(value: typeof Narrator['fonts'][number]) {
    game.settings?.set('wonderlost', 'narrator-title-font', value);
  }

  public get textFont() {
    return this.getSetting<typeof Narrator['fonts'][number]>("Text Font") ?? "GhostTheory2";
  }
  public static get textFont() {
    return game.settings?.get('wonderlost', 'narrator-text-font') as typeof Narrator['fonts'][number]
      ?? "GhostTheory2";
  }
  public static set textFont(value: typeof Narrator['fonts'][number]) {
    game.settings?.set('wonderlost', 'narrator-text-font', value);
  }

  public get titleWeight() {
    return this.getSetting<typeof Narrator['fontWeights'][number]>("Title Weight") ?? "400";
  }
  public static get titleWeight() {
    return game.settings?.get('wonderlost', 'narrator-title-weight') as typeof Narrator['fontWeights'][number]
      ?? "400";
  }
  public static set titleWeight(value: typeof Narrator['fontWeights'][number]) {
    game.settings?.set('wonderlost', 'narrator-title-weight', value);
  }

  constructor(DEBUG = false) {
    super({
      moduleName: "Narrator",
      moduleDescription: "An extremely customizable on screen narrator system",
      hooks: new Map([
        ['ready', async (app, data) => {
          // Load some essential fonts we use in PIXI
          await FontsLoader({
            custom: {
              families: [Narrator.titleFont, Narrator.textFont],
            },
          });

          if (this.DEBUG) {
            consola.success(`${this.moduleName} | Fonts loaded`, this);
          }

          const otherFonts = Narrator.fonts.filter(font =>
            font !== Narrator.titleFont && font !== Narrator.textFont
          );
          // Define a reusable font loading function
          const loadFonts = async (fonts: string[]): Promise<void> => {
            await FontsLoader({
              custom: {
                families: fonts,
              },
            });
          };

          // Load other fonts asynchronously
          await loadFonts(otherFonts);
        }]
      ]),
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
}
