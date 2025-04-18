
export const HookTypes = {
  // Core Lifecycle hooks
  init: "init",
  i18nInit: "i18nInit",
  setup: "setup",
  ready: "ready",
  error: "error",
  hotReload: "hotReload",
  
  // Game hooks
  pauseGame: "pauseGame",
  updateWorldTime: "updateWorldTime",
  
  // Canvas hooks
  canvasConfig: "canvasConfig",
  canvasInit: "canvasInit",
  canvasPan: "canvasPan",
  canvasReady: "canvasReady",
  canvasTearDown: "canvasTearDown",
  canvasDraw: "canvasDraw",
  dropCanvasData: "dropCanvasData",
  highlightObjects: "highlightObjects",
  
  // Application hooks
  renderApplication: "renderApplication",
  getApplicationHeaderButtons: "getApplicationHeaderButtons",
  closeApplication: "closeApplication",
  getSceneControlButtons: "getSceneControlButtons",
  hotbarDrop: "hotbarDrop",
  collapseSceneNavigation: "collapseSceneNavigation",
  getApplicationEntryContext: "getApplicationEntryContext",
  collapseSidebar: "collapseSidebar",
  changeSidebarTab: "changeSidebarTab",
  renderChatLog: "renderChatLog",
  
  // Canvas Group hooks
  drawGroup: "drawGroup",
  tearDownGroup: "tearDownGroup",
  
  // Canvas Layer hooks
  drawLayer: "drawLayer",
  tearDownLayer: "tearDownLayer",
  pastePlaceableObject: "pastePlaceableObject",
  activateLayer: "activateLayer",
  deactivateLayer: "deactivateLayer",
  
  // Active Effects hooks
  applyActiveEffect: "applyActiveEffect",
  
  // Compendium hooks
  updateCompendium: "updateCompendium",
  
  // Document hooks
  preCreateDocument: "preCreateDocument",
  preUpdateDocument: "preUpdateDocument",
  preDeleteDocument: "preDeleteDocument",
  createDocument: "createDocument",
  updateDocument: "updateDocument",
  deleteDocument: "deleteDocument",
  
  // Placeable Object hooks
  drawObject: "drawObject",
  refreshObject: "refreshObject",
  destroyObject: "destroyObject",
  controlObject: "controlObject",
  hoverObject: "hoverObject",
  
  // Token hooks
  applyTokenStatusEffect: "applyTokenStatusEffect",
  chatBubble: "chatBubble",
  modifyTokenAttribute: "modifyTokenAttribute",
  targetToken: "targetToken",
  
  // Note hooks
  activateNote: "activateNote",
  
  // Effects hooks
  initializeRenderedEffectSourceShaders: "initializeRenderedEffectSourceShaders",
  
  // Cards hooks
  dealCards: "dealCards",
  passCards: "passCards",
  returnCards: "returnCards",
  
  // Actor Sheet hooks
  dropActorSheetData: "dropActorSheetData",
  
  // Canvas Visibility hooks
  initializeVisionSources: "initializeVisionSources",
  lightingRefresh: "lightingRefresh",
  visibilityRefresh: "visibilityRefresh",
  initializeLightSources: "initializeLightSources",
  initializeDarknessSources: "initializeDarknessSources",
  sightRefresh: "sightRefresh",
  
  // Weather hooks
  initializeWeatherEffects: "initializeWeatherEffects",
  
  // Adventure hooks
  preImportAdventure: "preImportAdventure",
  importAdventure: "importAdventure",
  
  // User hooks
  userConnected: "userConnected",
  
  // Combat hooks
  combatTurnChange: "combatTurnChange",
  combatStart: "combatStart",
  combatTurn: "combatTurn",
  combatRound: "combatRound",
  
  // ProseMirror hooks
  getProseMirrorMenuDropDowns: "getProseMirrorMenuDropDowns",
  getProseMirrorMenuItems: "getProseMirrorMenuItems",
  createProseMirrorEditor: "createProseMirrorEditor",
  
  // Chat hooks
  chatMessage: "chatMessage",
  renderChatMessage: "renderChatMessage",
  
  // Audio-Video hooks
  globalVolumeChanged: "globalVolumeChanged",
  rtcSettingsChanged: "rtcSettingsChanged",
  
  // Roll Table hooks
  dropRollTableSheetData: "dropRollTableSheetData",
  
  // Dynamic Token Ring hooks
  initializeDynamicTokenRingConfig: "initializeDynamicTokenRingConfig",
} as const;

export type HookableEvents = keyof typeof HookTypes;

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
