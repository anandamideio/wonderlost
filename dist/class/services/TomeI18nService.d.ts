/**
 * Service for managing Tome internationalization (i18n)
 */
export declare class TomeI18nService {
    private lowercaseName;
    constructor(lowercaseName: string);
    /**
     * Get the module's i18n namespace
     * @returns The namespace used for i18n keys
     */
    get namespace(): string;
    /**
     * Localize a string key
     * @param key The localization key within this module's namespace
     * @returns The localized string
     */
    localize(key: string): string;
    /**
     * Format a localized string with data
     * @param key The localization key within this module's namespace
     * @param data The data to use in the template
     * @returns The formatted string
     */
    format(key: string, data: Record<string, unknown>): string;
    /**
     * Check if a translation key exists
     * @param key The localization key within this module's namespace
     * @returns Whether the key exists
     */
    hasTranslation(key: string): boolean;
    /**
     * Get the full i18n key including namespace
     * @param key The localization key within this module's namespace
     * @returns The full key with namespace
     */
    getFullKey(key: string): string;
    /**
     * Localize multiple keys at once
     * @param keys Array of localization keys
     * @returns Object mapping keys to localized strings
     */
    localizeMany(keys: string[]): Record<string, string>;
}
//# sourceMappingURL=TomeI18nService.d.ts.map