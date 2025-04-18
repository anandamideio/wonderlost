
/**
 * A comprehensive enum containing all Foundry VTT hooks with detailed documentation.
 */
export const HookTypes = {
  // -------------------------------------------- 
  // Core lifecycle                              
  // -------------------------------------------- 

  /**
   * A hook event that fires as Foundry is initializing, right before any
   * initialization tasks have begun.
   * @category CoreLifecycle
   */
  init: "init",

  /**
   * A hook event that fires once Localization translations have been loaded and are ready for use.
   * @category CoreLifecycle
   */
  i18nInit: "i18nInit",

  /**
   * A hook event that fires when Foundry has finished initializing but
   * before the game state has been set up. Fires before any Documents, UI
   * applications, or the Canvas have been initialized.
   * @category CoreLifecycle
   */
  setup: "setup",

  /**
   * A hook event that fires when the game is fully ready.
   * @category CoreLifecycle
   */
  ready: "ready",

  /**
   * A hook event that fires whenever foundry experiences an error.
   * @category CoreLifecycle
   * @param {string} location - The method where the error was caught
   * @param {Error} err - The error
   * @param {object} [data={}] - Additional data that might be provided, based on the nature of the error
   */
  error: "error",

  /**
   * A hook event that fires when a package that is being watched by the hot reload system has a file changed.
   * @category HotReload
   * @param {HotReloadData} data - The hot reload data
   * @returns {boolean|void} - Explicitly return false to prevent the core software from handling the hot reload
   */
  hotReload: "hotReload",

  // -------------------------------------------- 
  // Game                                        
  // -------------------------------------------- 

  /**
   * A hook event that fires when the game is paused or un-paused.
   * @category Game
   * @param {boolean} paused - Is the game now paused (true) or un-paused (false)
   */
  pauseGame: "pauseGame",

  /**
   * A hook event that fires when the official World time is changed.
   * @category Game
   * @param {number} worldTime - The new canonical World time
   * @param {number} dt - The delta
   * @param {object} options - Options passed from the requesting client where the change was made
   * @param {string} userId - The ID of the User who advanced the time
   */
  updateWorldTime: "updateWorldTime",

  // -------------------------------------------- 
  // Canvas                                      
  // -------------------------------------------- 

  /**
   * A hook event that fires immediately prior to PIXI Application construction with the configuration parameters.
   * @category Canvas
   * @param {object} config - Canvas configuration parameters that will be used to initialize the PIXI.Application
   */
  canvasConfig: "canvasConfig",

  /**
   * A hook event that fires when the Canvas is initialized.
   * @category Canvas
   * @param {Canvas} canvas - The Canvas instance being initialized
   */
  canvasInit: "canvasInit",

  /**
   * A hook event that fires when the Canvas is panned.
   * @category Canvas
   * @param {Canvas} canvas - The Canvas instance
   * @param {object} position - The applied camera position with x, y, and scale properties
   */
  canvasPan: "canvasPan",

  /**
   * A hook event that fires when the Canvas is ready.
   * @category Canvas
   * @param {Canvas} canvas - The Canvas which is now ready for use
   */
  canvasReady: "canvasReady",

  /**
   * A hook event that fires when the Canvas is deactivated.
   * @category Canvas
   * @param {Canvas} canvas - The Canvas instance being deactivated
   */
  canvasTearDown: "canvasTearDown",

  /**
   * A hook event that fires when the Canvas is beginning to draw the canvas groups.
   * @category Canvas
   * @param {Canvas} canvas - The Canvas instance being drawn
   */
  canvasDraw: "canvasDraw",

  /**
   * A hook event that fires when some useful data is dropped onto the Canvas.
   * @category Canvas
   * @param {Canvas} canvas - The Canvas
   * @param {object} data - The data that has been dropped onto the Canvas
   */
  dropCanvasData: "dropCanvasData",

  /**
   * A hook event that fires when objects are highlighted on the canvas.
   * @category Canvas
   * @param {boolean} active - Is the highlight state now active
   */
  highlightObjects: "highlightObjects",

  // -------------------------------------------- 
  // Application                                 
  // -------------------------------------------- 

  /**
   * A hook event that fires whenever an Application is rendered.
   * @category Application
   * @param {Application} application - The Application instance being rendered
   * @param {jQuery} html - The inner HTML of the document that will be displayed and may be modified
   * @param {object} data - The object of data used when rendering the application
   */
  renderApplication: "renderApplication",

  /**
   * A hook event that fires whenever this Application is first rendered to add buttons to its header.
   * @category Application
   * @param {Application} app - The Application instance being rendered
   * @param {ApplicationHeaderButton[]} buttons - The array of header buttons which will be displayed
   */
  getApplicationHeaderButtons: "getApplicationHeaderButtons",

  /**
   * A hook event that fires whenever this Application is closed.
   * @category Application
   * @param {Application} app - The Application instance being closed
   * @param {jQuery[]} html - The application HTML when it is closed
   */
  closeApplication: "closeApplication",

  /**
   * A hook event that fires when the Scene controls are initialized.
   * @category Application
   * @param {SceneControl[]} controls - The SceneControl configurations
   */
  getSceneControlButtons: "getSceneControlButtons",

  /**
   * A hook event that fires whenever data is dropped into a Hotbar slot.
   * @category Application
   * @param {Hotbar} hotbar - The Hotbar application instance
   * @param {object} data - The dropped data object
   * @param {number} slot - The target hotbar slot
   * @returns {boolean|void} - Explicitly return false to prevent default handling
   */
  hotbarDrop: "hotbarDrop",

  /**
   * A hook event that fires whenever scene navigation is collapsed.
   * @category Application
   * @param {SceneNavigation} sceneNavigation - The scene navigation instance
   * @param {boolean} collapsed - Whether the navigation is now collapsed
   */
  collapseSceneNavigation: "collapseSceneNavigation",

  /**
   * A hook event that fires when the context menu for entries in an Application is constructed.
   * @category Application
   * @param {Application} application - The Application instance
   * @param {ContextMenuEntry[]} entryOptions - The context menu entries
   */
  getApplicationEntryContext: "getApplicationEntryContext",

  /**
   * A hook event that fires when the Sidebar is collapsed or expanded.
   * @category Application
   * @param {Sidebar} sidebar - The Sidebar application
   * @param {boolean} collapsed - Whether the Sidebar is now collapsed or not
   */
  collapseSidebar: "collapseSidebar",

  /**
   * A hook event that fires when the Sidebar tab is changed.
   * @category Application
   * @param {SidebarTab} app - The SidebarTab application which is now active
   */
  changeSidebarTab: "changeSidebarTab",

  // -------------------------------------------- 
  // Canvas Group                                
  // -------------------------------------------- 

  /**
   * A hook event that fires when a CanvasGroup is drawn.
   * @category CanvasGroup
   * @param {CanvasGroup} group - The group being drawn
   */
  drawGroup: "drawGroup",

  /**
   * A hook event that fires when a CanvasGroup is deconstructed.
   * @category CanvasGroup
   * @param {CanvasGroup} group - The group being deconstructed
   */
  tearDownGroup: "tearDownGroup",

  // -------------------------------------------- 
  // Canvas Layer                                
  // -------------------------------------------- 

  /**
   * A hook event that fires when a CanvasLayer is drawn.
   * @category CanvasLayer
   * @param {CanvasLayer} layer - The layer being drawn
   */
  drawLayer: "drawLayer",

  /**
   * A hook event that fires when a CanvasLayer is deconstructed.
   * @category CanvasLayer
   * @param {CanvasLayer} layer - The layer being deconstructed
   */
  tearDownLayer: "tearDownLayer",

  /**
   * A hook event that fires when any PlaceableObject is pasted onto the Scene.
   * @category CanvasLayer
   * @param {PlaceableObject[]} copied - The PlaceableObjects that were copied
   * @param {object[]} createData - The new objects that will be added to the Scene
   */
  pastePlaceableObject: "pastePlaceableObject",

  // -------------------------------------------- 
  // Active Effects                              
  // -------------------------------------------- 

  /**
   * A hook event that fires when a custom active effect is applied.
   * @category Active Effects
   * @param {Actor} actor - The actor the active effect is being applied to
   * @param {EffectChangeData} change - The change data being applied
   * @param {*} current - The current value being modified
   * @param {*} delta - The parsed value of the change object
   * @param {object} changes - An object which accumulates changes to be applied
   */
  applyActiveEffect: "applyActiveEffect",

  // -------------------------------------------- 
  // Compendium                                  
  // -------------------------------------------- 

  /**
   * A hook event that fires whenever the contents of a Compendium pack were modified.
   * @category Compendium
   * @param {CompendiumCollection} pack - The Compendium pack being modified
   * @param {Document[]} documents - The locally-cached Documents which were modified
   * @param {object} options - Additional options which modified the modification request
   * @param {string} userId - The ID of the User who triggered the modification workflow
   */
  updateCompendium: "updateCompendium",

  // -------------------------------------------- 
  // Document                                    
  // -------------------------------------------- 

  /**
   * A hook event that fires before execution of a creation workflow.
   * @category Document
   * @param {Document} document - The pending document which is requested for creation
   * @param {object} data - The initial data object provided to the document creation request
   * @param {object} options - Additional options which modify the creation request
   * @param {string} userId - The ID of the requesting user, always game.user.id
   * @returns {boolean|void} - Explicitly return false to prevent creation
   */
  preCreateDocument: "preCreateDocument",

  /**
   * A hook event that fires before execution of an update workflow.
   * @category Document
   * @param {Document} document - The Document instance being updated
   * @param {object} changed - Differential data that will be used to update the document
   * @param {object} options - Additional options which modify the update request
   * @param {string} userId - The ID of the requesting user, always game.user.id
   * @returns {boolean|void} - Explicitly return false to prevent update
   */
  preUpdateDocument: "preUpdateDocument",

  /**
   * A hook event that fires before execution of a deletion workflow.
   * @category Document
   * @param {Document} document - The Document instance being deleted
   * @param {object} options - Additional options which modify the deletion request
   * @param {string} userId - The ID of the requesting user, always game.user.id
   * @returns {boolean|void} - Explicitly return false to prevent deletion
   */
  preDeleteDocument: "preDeleteDocument",

  /**
   * A hook event that fires after conclusion of a creation workflow.
   * @category Document
   * @param {Document} document - The new Document instance which has been created
   * @param {object} options - Additional options which modified the creation request
   * @param {string} userId - The ID of the User who triggered the creation workflow
   */
  createDocument: "createDocument",

  /**
   * A hook event that fires after conclusion of an update workflow.
   * @category Document
   * @param {Document} document - The existing Document which was updated
   * @param {object} changed - Differential data that was used to update the document
   * @param {object} options - Additional options which modified the update request
   * @param {string} userId - The ID of the User who triggered the update workflow
   */
  updateDocument: "updateDocument",

  /**
   * A hook event that fires after conclusion of a deletion workflow.
   * @category Document
   * @param {Document} document - The existing Document which was deleted
   * @param {object} options - Additional options which modified the deletion request
   * @param {string} userId - The ID of the User who triggered the deletion workflow
   */
  deleteDocument: "deleteDocument",

  // -------------------------------------------- 
  // Placeable Object                            
  // -------------------------------------------- 

  /**
   * A hook event that fires when a PlaceableObject is initially drawn.
   * @category PlaceableObject
   * @param {PlaceableObject} object - The object instance being drawn
   */
  drawObject: "drawObject",

  /**
   * A hook event that fires when a PlaceableObject is incrementally refreshed.
   * @category PlaceableObject
   * @param {PlaceableObject} object - The object instance being refreshed
   */
  refreshObject: "refreshObject",

  /**
   * A hook event that fires when a PlaceableObject is destroyed.
   * @category PlaceableObject
   * @param {PlaceableObject} object - The object instance being destroyed
   */
  destroyObject: "destroyObject",

  /**
   * A hook event that fires when a PlaceableObject is selected or deselected.
   * @category PlaceableObject
   * @param {PlaceableObject} object - The object instance which is selected/deselected
   * @param {boolean} controlled - Whether the PlaceableObject is selected or not
   */
  controlObject: "controlObject",

  /**
   * A hook event that fires when a PlaceableObject is hovered over or out.
   * @category PlaceableObject
   * @param {PlaceableObject} object - The object instance
   * @param {boolean} hovered - Whether the PlaceableObject is hovered over or not
   */
  hoverObject: "hoverObject",

  // -------------------------------------------- 
  // Token                                       
  // -------------------------------------------- 

  /**
   * A hook event that fires when a token should apply a specific status effect.
   * @category Token
   * @param {Token} token - The token affected
   * @param {string} statusId - The status effect ID being applied, from CONFIG.specialStatusEffects
   * @param {boolean} active - Is the special status effect now active?
   */
  applyTokenStatusEffect: "applyTokenStatusEffect",

  /**
   * A hook event that fires when a chat bubble is initially configured.
   * @category Token
   * @param {Token} token - The speaking token
   * @param {jQuery} html - The HTML of the chat bubble
   * @param {string} message - The spoken message text
   * @param {object} options - Provided options which affect bubble appearance
   * @returns {void|false} - May return false to prevent the calling workflow
   */
  chatBubble: "chatBubble",

  /**
   * A hook event that fires when a token's resource bar attribute has been modified.
   * @category Token
   * @param {object} data - An object describing the modification
   * @param {object} updates - The update delta that will be applied to the Token's actor
   */
  modifyTokenAttribute: "modifyTokenAttribute",

  /**
   * A hook event that fires when a token is targeted or un-targeted.
   * @category Token
   * @param {User} user - The User doing the targeting
   * @param {Token} token - The targeted Token
   * @param {boolean} targeted - Whether the Token has been targeted or untargeted
   */
  targetToken: "targetToken",

  // -------------------------------------------- 
  // Note                                        
  // -------------------------------------------- 

  /**
   * A hook event that fires whenever a map note is double-clicked.
   * @category Note
   * @param {Note} note - The note that was activated
   * @param {object} options - Options for rendering the associated JournalSheet
   * @returns {boolean|void} - Hooked functions may cancel the render by returning false
   */
  activateNote: "activateNote",

  // -------------------------------------------- 
  // Point Source                                
  // -------------------------------------------- 

  /**
   * A hook event that fires after RenderedPointSource shaders have initialized.
   * @category PointSource
   * @param {RenderedEffectSource} source - The RenderedEffectSource instance being initialized
   */
  initializeRenderedEffectSourceShaders: "initializeRenderedEffectSourceShaders",

  // -------------------------------------------- 
  // Cards                                       
  // -------------------------------------------- 

  /**
   * A hook event that fires when Cards are dealt from a deck to other hands.
   * @category Cards
   * @param {Cards} origin - The origin Cards document
   * @param {Cards[]} destinations - An array of destination Cards documents
   * @param {object} context - Additional context which describes the operation
   */
  dealCards: "dealCards",

  /**
   * A hook event that fires when Cards are passed from one stack to another.
   * @category Cards
   * @param {Cards} origin - The origin Cards document
   * @param {Cards} destination - The destination Cards document
   * @param {object} context - Additional context which describes the operation
   */
  passCards: "passCards",

  /**
   * A hook event that fires when Cards are returned to their original deck.
   * @category Cards
   * @param {Cards} origin - The origin Cards document
   * @param {Card[]} returned - The cards being returned
   * @param {object} context - Additional context which describes the operation
   */
  returnCards: "returnCards",

  // -------------------------------------------- 
  // Actor Sheet                                 
  // -------------------------------------------- 

  /**
   * A hook event that fires when some useful data is dropped onto an ActorSheet.
   * @category ActorSheet
   * @param {Actor} actor - The Actor
   * @param {ActorSheet} sheet - The ActorSheet application
   * @param {object} data - The data that has been dropped onto the sheet
   */
  dropActorSheetData: "dropActorSheetData",

  // -------------------------------------------- 
  // Interaction Layer                           
  // -------------------------------------------- 

  /**
   * A hook event that fires with a InteractionLayer becomes active.
   * @category InteractionLayer
   * @param {InteractionLayer} layer - The layer becoming active
   */
  activateLayer: "activateLayer",

  /**
   * A hook event that fires with a InteractionLayer becomes inactive.
   * @category InteractionLayer
   * @param {InteractionLayer} layer - The layer becoming inactive
   */
  deactivateLayer: "deactivateLayer",

  // -------------------------------------------- 
  // Canvas Visibility                           
  // -------------------------------------------- 

  /**
   * A hook event that fires when the set of vision sources are initialized.
   * @category CanvasVisibility
   * @param {Collection<string, VisionSource>} sources - The collection of current vision sources
   */
  initializeVisionSources: "initializeVisionSources",

  /**
   * A hook event that fires when the LightingLayer is refreshed.
   * @category EffectsCanvasGroup
   * @param {EffectsCanvasGroup} group - The EffectsCanvasGroup instance
   */
  lightingRefresh: "lightingRefresh",

  /**
   * A hook event that fires when visibility is refreshed.
   * @category CanvasVisibility
   * @param {CanvasVisibility} visibility - The CanvasVisibility instance
   */
  visibilityRefresh: "visibilityRefresh",

  /**
   * A hook event that fires during light source initialization.
   * @category CanvasVisibility
   * @param {EffectsCanvasGroup} group - The EffectsCanvasGroup where light sources are initialized
   */
  initializeLightSources: "initializeLightSources",

  /**
   * A hook event that fires during darkness source initialization.
   * @category CanvasVisibility
   * @param {EffectsCanvasGroup} group - The EffectsCanvasGroup where darkness sources are initialized
   */
  initializeDarknessSources: "initializeDarknessSources",

  /**
   * A hook event that fires when the CanvasVisibility layer has been refreshed.
   * @category CanvasVisibility
   * @param {CanvasVisibility} visibility - The CanvasVisibility layer
   */
  sightRefresh: "sightRefresh",

  // -------------------------------------------- 
  // Weather                                     
  // -------------------------------------------- 

  /**
   * A hook event that fires when initializing a weather effect.
   * @category Weather
   * @param {WeatherEffects} weatherEffect - The weather effects canvas layer
   * @param {object} weatherEffectsConfig - The weather effects config object
   */
  initializeWeatherEffects: "initializeWeatherEffects",

  // -------------------------------------------- 
  // Adventure                                   
  // -------------------------------------------- 

  /**
   * A hook event that fires when Adventure data is being prepared for import.
   * @category Adventure
   * @param {Adventure} adventure - The Adventure document from which content is being imported
   * @param {object} formData - Processed data from the importer form
   * @param {Record<string, object[]>} toCreate - Adventure data which needs to be created in the World
   * @param {Record<string, object[]>} toUpdate - Adventure data which needs to be updated in the World
   * @returns {boolean|void} - False to prevent the core software from handling the import
   */
  preImportAdventure: "preImportAdventure",

  /**
   * A hook event that fires after an Adventure has been imported into the World.
   * @category Adventure
   * @param {Adventure} adventure - The Adventure document from which content was imported
   * @param {object} formData - Processed data from the importer form
   * @param {Record<string, Document[]>} created - Documents which were created in the World
   * @param {Record<string, Document[]>} updated - Documents which were updated in the World
   */
  importAdventure: "importAdventure",

  // -------------------------------------------- 
  // User                                        
  // -------------------------------------------- 

  /**
   * A hook event that fires whenever some other User joins or leaves the game session.
   * @category User
   * @param {User} user - The User who has connected or disconnected
   * @param {boolean} connected - Is the user now connected (true) or disconnected (false)
   */
  userConnected: "userConnected",

  // -------------------------------------------- 
  // Combat                                      
  // -------------------------------------------- 

  /**
   * A hook event which fires when the turn order of a Combat encounter is progressed.
   * @category Combat
   * @param {Combat} combat - The Combat encounter for which the turn order has changed
   * @param {CombatHistoryData} prior - The prior turn state
   * @param {CombatHistoryData} current - The new turn state
   */
  combatTurnChange: "combatTurnChange",

  /**
   * A hook event that fires when a Combat encounter is started.
   * @category Combat
   * @param {Combat} combat - The Combat encounter which is starting
   * @param {object} updateData - An object which contains Combat properties that will be updated
   */
  combatStart: "combatStart",

  /**
   * A hook event that fires when the turn of the Combat encounter changes.
   * @category Combat
   * @param {Combat} combat - The Combat encounter which is advancing or rewinding its turn
   * @param {object} updateData - An object which contains Combat properties that will be updated
   * @param {object} updateOptions - An object which contains options provided to the update method
   */
  combatTurn: "combatTurn",

  /**
   * A hook event that fires when the round of the Combat encounter changes.
   * @category Combat
   * @param {Combat} combat - The Combat encounter which is advancing or rewinding its round
   * @param {object} updateData - An object which contains Combat properties that will be updated
   * @param {object} updateOptions - An object which contains options provided to the update method
   */
  combatRound: "combatRound",

  // -------------------------------------------- 
  // ProseMirror                                 
  // -------------------------------------------- 

  /**
   * A hook event that fires when a ProseMirrorMenu's drop-downs are initialized.
   * @category ProseMirrorMenu
   * @param {ProseMirrorMenu} menu - The ProseMirrorMenu instance
   * @param {object} config - The drop-down configuration data
   */
  getProseMirrorMenuDropDowns: "getProseMirrorMenuDropDowns",

  /**
   * A hook event that fires when a ProseMirrorMenu's buttons are initialized.
   * @category ProseMirrorMenu
   * @param {ProseMirrorMenu} menu - The ProseMirrorMenu instance
   * @param {ProseMirrorMenuItem[]} config - The button configuration objects
   */
  getProseMirrorMenuItems: "getProseMirrorMenuItems",

  /**
   * A hook event that fires whenever a ProseMirror editor is created.
   * @category ProseMirrorEditor
   * @param {string} uuid - A UUID that uniquely identifies this ProseMirror instance
   * @param {Record<string, Plugin>} plugins - A list of plugins that will be loaded
   * @param {object} options - The provisional EditorState and ProseMirrorMenuPlugin
   */
  createProseMirrorEditor: "createProseMirrorEditor",

  // -------------------------------------------- 
  // Chat                                        
  // -------------------------------------------- 

  /**
   * A hook event that fires when a user sends a message through the ChatLog.
   * @category Chat
   * @param {ChatLog} chatLog - The ChatLog instance
   * @param {string} message - The trimmed message content
   * @param {object} chatData - Some basic chat data
   */
  chatMessage: "chatMessage",

  /**
   * A hook event that fires for each ChatMessage which is rendered for addition to the ChatLog.
   * @category Chat
   * @param {ChatMessage} message - The ChatMessage document being rendered
   * @param {jQuery} html - The pending HTML as a jQuery object
   * @param {object} data - The input data provided for template rendering
   */
  renderChatMessage: "renderChatMessage",

  // -------------------------------------------- 
  // Audio-Video                                 
  // -------------------------------------------- 

  /**
   * A hook event that fires when the user modifies a global volume slider.
   * @category Audio-Video
   * @param {number} volume - The new volume level
   */
  globalVolumeChanged: "globalVolumeChanged",

  /**
   * A hook event that fires when the AV settings are changed.
   * @category Audio-Video
   * @param {AVSettings} settings - The AVSettings manager
   * @param {object} changed - The delta of the settings that have been changed
   */
  rtcSettingsChanged: "rtcSettingsChanged",

  // -------------------------------------------- 
  // RollTableConfig                             
  // -------------------------------------------- 

  /**
   * A hook event that fires when some useful data is dropped onto a RollTableConfig.
   * @category RollTableConfig
   * @param {RollTable} table - The RollTable
   * @param {RollTableConfig} sheet - The RollTableConfig application
   * @param {object} data - The data dropped onto the RollTableConfig
   */
  dropRollTableSheetData: "dropRollTableSheetData",

  // -------------------------------------------- 
  // Dynamic Token Ring                          
  // -------------------------------------------- 

  /**
   * A hook event that allows to pass custom dynamic ring configurations.
   * @category DynamicTokenRing
   * @param {TokenRingConfig} ringConfig - The ring configuration instance
   */
  initializeDynamicTokenRingConfig: "initializeDynamicTokenRingConfig",


  // -------------------------------------------- 
  // Found Hooks (Undocumented)                   
  // -------------------------------------------- 
  renderChatLog: "renderChatLog",
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
