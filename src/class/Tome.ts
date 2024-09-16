import consola from 'consola';

abstract class Rule {
  public name: string;
  public label?: string;
  public icon?: string;
  public restricted?: boolean;
  public onChange?: (value: any) => void | Promise<void>;
  public requiresReload?: boolean;

  constructor({ name, label, icon, restricted, onChange, requiresReload }: Rule) {
    this.name = name;
    this.label = label;
    this.icon = icon;
    this.restricted = restricted;
    this.onChange = onChange;
    this.requiresReload = requiresReload;
  }
}

export class NumberRule extends Rule {
  public type = Number;
  public range?: { min?: number; max?: number, step?: number };
  public defaultValue?: number;

  constructor({ name, label, icon, onChange, restricted, range, defaultValue }: Omit<NumberRule, 'type'>) {
    super({ name, label, icon, onChange, restricted });
    this.range = range;
    this.defaultValue = defaultValue;
  }
}

export const isNumberRule = (rule: Rules): rule is NumberRule => rule.type instanceof Number;

export class BooleanRule extends Rule {
  public type = Boolean;
  public defaultValue?: boolean;

  constructor({ name, label, icon, onChange, restricted, defaultValue }: Omit<BooleanRule, 'type'>) {
    super({ name, label, icon, onChange, restricted });
    this.defaultValue = defaultValue;
  }
}

export const isBooleanRule = (rule: Rules): rule is BooleanRule => rule.type instanceof Boolean;

export class StringRule extends Rule {
  public type = String;
  public defaultValue?: string;
  public filePicker?: "any" | "image" | "video" | "audio" | "document";
  public choices?: { [key: string]: string };

  constructor({ name, label, icon, onChange, choices, restricted, defaultValue, filePicker }: Omit<StringRule, 'type'>) {
    super({ name, label, icon, onChange, restricted });
    this.defaultValue = defaultValue;
    this.filePicker = filePicker;
    this.choices = choices;
  }
}

export const isStringRule = (rule: Rules): rule is StringRule => rule.type instanceof String;

type Rules = NumberRule | BooleanRule | StringRule;

export class TomeRules {
  private GlobalSettings: Array<Rules> = [];
  private ClientSettings: Array<Rules> = [];

  public get globalSettings() {
    return this.GlobalSettings;
  }

  public get clientSettings() {
    return this.ClientSettings;
  }

  public addGlobal(newRule: Rules) {
    switch (newRule.type) {
      case Number:
        this.GlobalSettings.push(new NumberRule(newRule as NumberRule));
        break;
      case Boolean:
        this.GlobalSettings.push(new BooleanRule(newRule as BooleanRule));
        break;
      case String:
        this.GlobalSettings.push(new StringRule(newRule as StringRule));
        break;
      default:
        throw new Error(`Unsupported rule type: ${newRule.type}`);
    }
  }

  constructor(pSettings?: {
    globalSettings: Array<NumberRule | BooleanRule | StringRule>;
    clientSettings: Array<Rules>;
  }) {
    if (pSettings) {
      this.GlobalSettings = [...pSettings.globalSettings];
      this.ClientSettings = [...pSettings.clientSettings];
    }
  }
}

export abstract class Tome {
  public moduleName: string;
  public moduleDescription: string;
  public settings: TomeRules;
  public DEBUG?: boolean = false;

  constructor(pTome: Omit<Tome, 'settings' | 'registerRules'> & { settings?: TomeRules }) {
    this.moduleName = pTome.moduleName;
    this.moduleDescription = pTome.moduleDescription;
    this.settings = new TomeRules(pTome?.settings);
    this.DEBUG = wonderlost?.DEBUG ?? false;
  }

  public registerRules() {
    this.settings.globalSettings.forEach(setting => {
      if (this.DEBUG) consola.info(`Registering global setting: ${setting.name}`);

      game.settings?.register(this.moduleName, setting.name, {
        name: setting.name,
        hint: setting.label,
        scope: 'world',
        config: true,
        default: setting?.defaultValue,
        type: setting?.type,
        // @ts-ignore
        choices: setting?.choices,
        // @ts-ignore
        range: setting?.range,
        onChange: setting.onChange,
        requiresReload: setting.requiresReload,
      })
    })
  }
}
