/**
 * Service for managing Tome internationalization (i18n)
 */
export class TomeI18nService {
  constructor(private lowercaseName: string) {}

  /**
   * Get the module's i18n namespace
   * @returns The namespace used for i18n keys
   */
  get namespace(): string {
    return this.lowercaseName;
  }

  /**
   * Localize a string key
   * @param key The localization key within this module's namespace
   * @returns The localized string
   */
  localize(key: string): string {
    const fullKey = `${this.namespace}.${key}`;
    return game.i18n!.localize(fullKey);
  }

  /**
   * Format a localized string with data
   * @param key The localization key within this module's namespace
   * @param data The data to use in the template
   * @returns The formatted string
   */
  format(key: string, data: Record<string, unknown>): string {
    const fullKey = `${this.namespace}.${key}`;
    return game.i18n!.format(fullKey, data);
  }

  /**
   * Check if a translation key exists
   * @param key The localization key within this module's namespace
   * @returns Whether the key exists
   */
  hasTranslation(key: string): boolean {
    const fullKey = `${this.namespace}.${key}`;
    return game.i18n!.has(fullKey);
  }

  /**
   * Get the full i18n key including namespace
   * @param key The localization key within this module's namespace
   * @returns The full key with namespace
   */
  getFullKey(key: string): string {
    return `${this.namespace}.${key}`;
  }

  /**
   * Localize multiple keys at once
   * @param keys Array of localization keys
   * @returns Object mapping keys to localized strings
   */
  localizeMany(keys: string[]): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key of keys) {
      result[key] = this.localize(key);
    }

    return result;
  }
}
