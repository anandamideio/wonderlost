import consola from 'consola';
import { TomeRules } from './Rules';

type HookableEvents = 'renderChatLog' | 'renderChatMessage'
type HookEvent = (app: Application, html: JQuery, data?: any) => void | Promise<void>;

export abstract class Tome {
  public moduleName: string;
  public moduleDescription: string;
  public settings: TomeRules;
  public hooks = new Map([] as Array<[HookableEvents, HookEvent]>);
  public DEBUG?: boolean = false;

  constructor(pTome: Pick<Tome, 'moduleDescription' | 'moduleName'> & { settings?: TomeRules, hooks?: Tome['hooks'] }) {
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

    this.settings.clientSettings.forEach(setting => {
      if (this.DEBUG) consola.info(`Registering client setting: ${setting.name}`);

      game.settings?.register(this.moduleName, setting.name, {
        name: setting.name,
        hint: setting.label,
        scope: 'client',
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

  public addHook(event: HookableEvents, callback: HookEvent, overwrite: boolean = false) {
    if (!this.hooks.has(event) || overwrite) {
      this.hooks.set(event, callback);
    } else {
      consola.warn(`Hook for event "${event}" already exists.`);
    }
  }

  public registerHooks() {
    this.hooks.forEach((callback, event) => {
      Hooks.on(event, callback);
      if (this.DEBUG) consola.info(`Registered hook for event: ${event}`);
    });
  }
}
