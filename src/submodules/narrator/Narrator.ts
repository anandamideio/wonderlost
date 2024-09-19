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
      settings: {
        globalSettings: [
          {
            name: "Title Font",
            hint: "The font used for the title text",
            type: String,
            defaultValue: "GhostTheory2",
            choices: Object.fromEntries(Narrator.fonts.map((font) => [font, font])),
            onChange: (value) => {
              Narrator.titleFont = value as typeof Narrator['fonts'][number];
            }
          },
          {
            name: "Text Font",
            hint: "The font used for the text body",
            type: String,
            defaultValue: "GhostTheory2",
            choices: Object.fromEntries(Narrator.fonts.map((font) => [font, font])),
            onChange: (value) => {
              Narrator.textFont = value as typeof Narrator['fonts'][number];
            }
          },
          {
            name: "Title Weight",
            hint: "The weight of the title font",
            type: String,
            defaultValue: "400",
            choices: Object.fromEntries(Narrator.fontWeights.map((weight) => [weight, weight])),
            onChange: (value) => {
              Narrator.titleWeight = value as typeof Narrator['fontWeights'][number];
            }
          }
        ]
      },
      hooks: new Map([
        ['ready', (app, data) => {
          // Load some essential fonts we use in PIXI
          FontsLoader({
            custom: {
              families: [Narrator.titleFont, Narrator.textFont],
            },
          });
          // async load everything else
          let oFonts = [];
          for (let idx = Narrator.fonts.length - 1; idx >= 0; --idx) {
            if (Narrator.fonts[idx] === Narrator.titleFont || Narrator.fonts[idx] === Narrator.textFont) {
              continue;
            }
            oFonts.push(Narrator.fonts[idx]);
          }
          const aLoader = async function (fonts: string[]) {
            FontsLoader({
              custom: {
                families: fonts,
              },
            });
          };

          aLoader(oFonts);
        }]
      ]),
      socketFns: new Map([]),
      DEBUG
    })
  }
}
