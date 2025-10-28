import type { RuleMenu, Rules } from 'src/types/wonderlost/Tome';
/**
 * Service for managing Tome settings
 */
export declare class TomeSettingsService {
    private moduleName;
    private lowercaseName;
    private localize;
    private onEnabledChange;
    private debug;
    private settings;
    constructor(moduleName: string, lowercaseName: string, localize: (key: string) => string, onEnabledChange: (enabled: boolean) => void, debug?: boolean);
    /**
     * Get all registered settings
     */
    get allSettings(): Array<Rules & {
        scope: 'world' | 'client';
    }>;
    /**
     * Check if the service has any settings
     */
    get hasSettings(): boolean;
    /**
     * Register settings from array
     */
    registerSettings(rules: Array<Rules & {
        scope: 'world' | 'client';
    }>): void;
    /**
     * Initialize all settings with error boundaries
     */
    initializeSettings(): Promise<void>;
    /**
     * Perform the actual settings initialization
     */
    private performSettingsInitialization;
    /**
     * Register the enabled/disabled toggle setting
     */
    private registerEnabledSetting;
    /**
     * Register a single setting with error boundary
     */
    private registerSingleSetting;
    /**
     * Get a setting value
     */
    getSetting<ExpectedReturn = unknown>(settingName: string): ExpectedReturn;
    /**
     * Set a setting value
     */
    setSetting(settingName: string, value: unknown): Promise<void>;
    /**
     * Register a settings submenu
     */
    registerSettingSubmenu<Data extends Record<string, unknown> = Record<string, unknown>>(menu: RuleMenu & {
        data: Data;
    }): void;
    /**
     * Convert a string to kebab-case
     */
    static kebabCase(str: string): string;
}
//# sourceMappingURL=TomeSettingsService.d.ts.map