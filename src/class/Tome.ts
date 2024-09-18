import consola from "consola";
import type { DataModel } from "src/types/foundry/common/abstract/module.mjs";

type HookableEvents = "renderChatLog" | "renderChatMessage";
type HookEvent = (
  app: Application,
  html: JQuery,
  data?: any,
) => void | Promise<void>;

// Define types for the rules
type RuleValue =
  | number
  | boolean
  | string
  | Record<string, unknown>
  | unknown[]
  | string;

interface Rule {
  name: string;
  label?: string;
  icon?: string;
  restricted?: boolean;
  onChange?: (value: unknown) => void | Promise<void>;
  requiresReload?: boolean;
}

// Define rule-specific types
type NumberRule = Rule & {
  type: typeof Number;
  range?: { min?: number; max?: number; step?: number };
  defaultValue?: number;
};
type BooleanRule = Rule & { type: typeof Boolean; defaultValue?: boolean };
type StringRule = Rule & { type: typeof String; defaultValue?: string };
type ObjectRule = Rule & {
  type: typeof Object;
  defaultValue?: Record<string, unknown>;
};
type ArrayRule = Rule & {
  type: typeof Array;
  defaultValue?: unknown[];
};
type ColorRule = Rule & { type: typeof Color; defaultValue?: string };

// Define the Rules union type
type Rules =
  | NumberRule
  | BooleanRule
  | StringRule
  | ObjectRule
  | ArrayRule
  | ColorRule;

interface TomeRuleConstructor {
  globalSettings?: Array<Rules & { scope?: "world" | "client" }>;
  clientSettings?: Array<Rules & { scope?: "world" | "client" }>;
}

export abstract class Tome {
  public moduleName: string;
  public moduleDescription: string;
  public settings: Array<Rules & { scope: "world" | "client" }> = [];
  public hooks = new Map([] as Array<[HookableEvents, HookEvent]>);
  public socketFns: Map<string, (data: unknown) => void> = new Map();
  public DEBUG?: boolean = false;

  constructor(
    pTome: Pick<Tome, "moduleDescription" | "moduleName"> & {
      settings?: TomeRuleConstructor;
      hooks?: Tome["hooks"];
      socketFns?: Tome["socketFns"];
      DEBUG?: boolean;
    },
  ) {
    this.moduleName = pTome.moduleName;
    this.moduleDescription = pTome.moduleDescription;
    if (pTome?.settings) {
      this.settings =
        pTome.settings.globalSettings?.map((s) => {
          s.scope = "world";
          return s as Rules & { scope: "world" };
        }) ?? [];

      this.settings.push(
        ...(pTome.settings.clientSettings?.map((s) => {
          s.scope = "client";
          return s as Rules & { scope: "client" };
        }) ?? []),
      );
    }

    this.hooks = pTome?.hooks ?? new Map();
    this.socketFns = pTome?.socketFns ?? new Map();
    this.DEBUG = pTome?.DEBUG ?? false;
  }

  public addHook(
    event: HookableEvents,
    callback: HookEvent,
    overwrite: boolean = false,
  ) {
    if (!this.hooks.has(event) || overwrite) {
      this.hooks.set(event, callback);
    } else {
      consola.warn(`Hook for event "${event}" already exists.`);
    }
  }

  public initializeHooks() {
    this.hooks.forEach((callback, event) => {
      Hooks.on(event, callback);
      if (this.DEBUG) consola.info(`Registered hook for event: ${event}`);
    });

    return this;
  }

  // Method to register global settings
  public registerSetting(rule: Rules & { scope: "world" | "client" }): Tome {
    switch (rule.type) {
      case Number:
        this.settings.push({ ...rule } as NumberRule & {
          scope: "world" | "client";
        });
        break;
      case Boolean:
        this.settings.push({ ...rule } as BooleanRule & {
          scope: "world" | "client";
        });
        break;
      case String:
        this.settings.push({ ...rule } as StringRule & {
          scope: "world" | "client";
        });
        break;
      case Object:
        this.settings.push({ ...rule } as ObjectRule & {
          scope: "world" | "client";
        });
        break;
      case Array:
        this.settings.push({ ...rule } as ArrayRule & {
          scope: "world" | "client";
        });
        break;
      case Color:
        this.settings.push({ ...rule } as ColorRule & {
          scope: "world" | "client";
        });
        break;
      default:
        throw new Error(`Unsupported rule type: ${rule.type}`);
    }

    return this;
  }

  public registerSettings(
    rules: Array<Rules & { scope: "world" | "client" }>,
  ): Tome {
    rules.forEach((rule) => {
      this.registerSetting(rule);
    });
    return this;
  }

  // Method to update settings
  public updateSettings(): void {
    const globalData = game.settings?.get(this.moduleName, "global") as Record<
      string,
      unknown
    >;
    const clientData = game.settings?.get(
      this.moduleName,
      game!.user!.id,
    ) as Record<string, unknown>;

    // Update global settings
    this.settings.forEach((rule) => {
      if (rule.scope === "world") {
        rule?.onChange?.(globalData[rule.name]);
      } else if (rule.scope === "client") {
        rule?.onChange?.(clientData[rule.name]);
      }
    });
  }

  // Method to save settings
  public saveSettings(): void {
    const rules = {
      world: {},
      client: {},
    } as Record<"world" | "client", Record<string, RuleValue>>;

    this.settings.forEach((rule) => {
      switch (rule.type) {
        case Number:
          rules[rule.scope][rule.name] = Number(rule.defaultValue);
          break;
        case Boolean:
          rules[rule.scope][rule.name] = Boolean(rule.defaultValue);
          break;
        case String:
          rules[rule.scope][rule.name] = String(rule.defaultValue);
          break;
        case Object:
          rules[rule.scope][rule.name] = JSON.stringify(
            Tome.expandObject(rule.defaultValue),
          );
          break;
        case Array:
          rules[rule.scope][rule.name] = JSON.stringify(
            JSON.parse(String(rule.defaultValue)),
          );
          break;
        case Color:
          rules[rule.scope][rule.name] = String(rule.defaultValue);
          break;
      }
    });

    game.settings?.register(this.moduleName, "global", rules.world);
    game.settings?.register(this.moduleName, game!.user!.id, rules.client);
  }

  public initializeSettings() {
    this.settings.forEach((setting) => {
      if (this.DEBUG) {
        consola.info(
          `[TOME::${this.moduleName}] => Registering ${setting.scope} setting: ${setting.name}`,
        );
      }

      game.settings?.register(this.moduleName, Tome.kabob(setting.name), {
        name: setting.name,
        hint: setting.label,
        scope: setting.scope,
        config: true,
        default: setting?.defaultValue,
        type: setting.type as unknown as DataModel<any, any>,
        // @ts-ignore
        choices: setting?.choices,
        // @ts-ignore
        range: setting?.range,
        onChange: setting.onChange,
        requiresReload: setting.requiresReload,
      });
    });

    return this;
  }

  public initializeSocketListeners() {
    if (this.socketFns.size === 0) return this;

    this.socketFns.forEach((fn, event) => {
      game.socket?.on(event, (data: unknown) => fn(data));
    });

    return this;
  }

  // Utility function to expand object rules
  static expandObject(value: unknown): Record<string, unknown> {
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).reduce(
        (acc, [key, val]) => {
          if (typeof val === "string") {
            try {
              acc[key] = JSON.parse(val);
            } catch (e) {
              acc[key] = val;
            }
          } else {
            acc[key] = val;
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );
    }
    throw new Error(`Expected object but received ${typeof value}`);
  }

  static kabob(str: string) {
    if (!str) return "";
    return str.split("").join("-");
  }
}
