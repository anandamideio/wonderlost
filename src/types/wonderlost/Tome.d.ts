import type { HookEvents } from "@anandamideio/foundry-types";

export type HookableEvents = keyof typeof HookEvents;

export type HookEvent = (
	app: Application,
	html: JQuery,
	data?: Record<string, unknown>,
) => void | Promise<void>;

interface RuleMenu extends ClientSettings.PartialSettingSubmenuConfig {}

export interface Rule {
	name: string;
	hint?: string;
	restricted?: boolean;
	onChange?: (value: unknown) => void | Promise<void>;
	/** true if you want to prompt the user to reload */
	requiresReload?: boolean;
	/**
	 * @default true
	 * @comment false if you dont want it to show in module config
	 */
	config?: boolean;
	choices?: Record<string, string>;
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
export type Rules =
	| NumberRule
	| BooleanRule
	| StringRule
	| ObjectRule
	| ArrayRule
	| ColorRule;

export interface TomeRuleConstructor {
	globalSettings?: Array<Rules & { scope?: "world" | "client" }>;
	clientSettings?: Array<Rules & { scope?: "world" | "client" }>;
}
