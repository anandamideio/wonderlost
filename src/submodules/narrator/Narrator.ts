import { Tome } from 'src/class/Tome';

/**
 * Options for the narrator text display
 */
interface NarratorTextOptions {
  /** Duration in milliseconds (default: 5000) */
  duration?: number;
  /** Font size in pixels (default: 48) */
  fontSize?: number;
  /** Text color in hex (default: '#ffffff') */
  fontColor?: string;
  /** Background color in hex (default: '#000000') */
  backgroundColor?: string;
  /** Background opacity 0-1 (default: 0.8) */
  opacity?: number;
  /** Font family to use (default: configured title font) */
  fontFamily?: string;
  /** Font weight (default: configured title weight) */
  fontWeight?: string;
  /** Font style (default: 'normal') */
  fontStyle?: 'normal' | 'italic' | 'oblique';
  /** Text alignment (default: 'center') */
  textAlign?: 'left' | 'center' | 'right';
  /** Word wrap width (default: 80% of canvas width) */
  wordWrapWidth?: number;
  /** Enable word wrapping (default: true) */
  wordWrap?: boolean;
  /** Animation options */
  animation?: {
    /** Animation duration in ms (default: 1000) */
    duration?: number;
    /** Animation easing (default: 'easeOutQuad') */
    easing?: string;
    /** Initial scale (default: 0.5) */
    initialScale?: number;
    /** Final scale (default: 1.2) */
    finalScale?: number;
    /** Initial opacity (default: 0) */
    initialAlpha?: number;
    /** Final opacity (default: 1) */
    finalAlpha?: number;
  };
}

/**
 * Narrator module for displaying cinematic text overlays
 */
export class Narrator extends Tome {
  // Available fonts for the narrator
  static readonly FONTS = [
    "Caslon", "CaslonAntique", "SignikaBold", "Riffic", "IronSans",
    "LinLibertine", "TimesNewRomance", "TimesNewYorker", "LPEducational",
    "Cardinal", "OldLondon", "StoneHenge", "SunnyDay", "PaulSignature",
    "LemonTuesday", "FairProsper", "BalletHarmony", "MagieraScript",
    "Cathallina", "Hamish", "DreamersBrush", "FastInMyCar", "ChildWriting",
    "Kindergarten", "FuturaHandwritten", "Fewriter", "TrashHand",
    "GoodBrush", "BaksoSapi", "SuplexmentaryComic", "ComicInk",
    "DreamyLand", "Yikes", "GangOfThree", "JianGkrik", "Yozakura",
    "Hiroshio", "ArabDances", "Rooters", "Subway", "Himagsikan",
    "MilTown", "Galactico", "Oko", "Ethnocentric", "VenusRising",
    "StampAct", "Kirsty", "Western", "BreakAway", "YoungerThanMe",
    "Underground", "VarsityTeam", "Valentino", "GlassHouses", "Makayla",
    "DancingVampyrish", "Codex", "DSNetStamped", "HappyFrushZero",
    "Shoplifter", "Stereofidelic", "Headache", "HorrorHouse", "GhostTheory2",
    "Syemox", "GhostChase"
  ] as const;

  // Available font weights
  static readonly FONT_WEIGHTS = [
    "100", "200", "300", "400", "500", "600", "700", "800", "900"
  ] as const;

  // Available font styles
  static readonly FONT_STYLES = [
    "normal", "italic", "oblique"
  ] as const;

  // Container for the narrator display
  private container: PIXI.Container | null = null;
  
  // Track if fonts have been loaded
  private fontsLoaded = false;

  constructor(debug = false) {
    super({
      moduleName: "Narrator",
      moduleDescription: "Customizable on-screen narrator system",
      DEBUG: debug
    });

    this.registerSettings([
      {
        name: "Title Font",
        hint: "The font used for narrator titles",
        type: String,
        scope: "world",
        restricted: false,
        defaultValue: "GhostTheory2",
        choices: Object.fromEntries(Narrator.FONTS.map(font => [font, font])),
      },
      {
        name: "Text Font",
        hint: "The font used for narrator text body",
        type: String,
        scope: "world",
        restricted: false,
        defaultValue: "GhostTheory2",
        choices: Object.fromEntries(Narrator.FONTS.map(font => [font, font])),
      },
      {
        name: "Title Weight",
        hint: "The weight of the title font",
        type: String,
        scope: "world",
        restricted: false,
        defaultValue: "400",
        choices: Object.fromEntries(Narrator.FONT_WEIGHTS.map(weight => [weight, weight])),
      }
    ]);

    // Register hook for initialization
    Hooks.once('canvasReady', () => this.setup());
  }

  /**
   * Get the configured title font
   */
  get titleFont(): typeof Narrator.FONTS[number] {
    return this.getSetting<typeof Narrator.FONTS[number]>("Title Font") ?? "GhostTheory2";
  }

  /**
   * Get the configured text font
   */
  get textFont(): typeof Narrator.FONTS[number] {
    return this.getSetting<typeof Narrator.FONTS[number]>("Text Font") ?? "GhostTheory2";
  }

  /**
   * Get the configured title weight
   */
  get titleWeight(): typeof Narrator.FONT_WEIGHTS[number] {
    return this.getSetting<typeof Narrator.FONT_WEIGHTS[number]>("Title Weight") ?? "400";
  }

  /**
   * Set up the narrator display system
   */
  private async setup(): Promise<void> {
    if (this.DEBUG) console.log("Narrator | Setting up");
    
    // Create a container for narrator elements
    this.container = new PIXI.Container();
    this.container.zIndex = 1000; // Position above most elements
    
    // Add the container to the interface layer
    canvas?.interface?.addChild(this.container);
    
    // Load fonts
    await this.loadFonts();
    
    this.ready = true;
    if (this.DEBUG) console.log("Narrator | Setup complete");
  }

  /**
   * Load required fonts
   */
  private async loadFonts(): Promise<void> {
    // Use FontsLoader to load the fonts
    // This is a simplified implementation - you would need to implement actual font loading
    try {
      // Load primary fonts first (the ones currently selected in settings)
      await this.loadFontSet([this.titleFont, this.textFont]);
      
      // Then load the rest for potential usage
      const otherFonts = Narrator.FONTS.filter(font => 
        font !== this.titleFont && font !== this.textFont
      );
      await this.loadFontSet(otherFonts);
      
      this.fontsLoaded = true;
      if (this.DEBUG) console.log("Narrator | Fonts loaded");
    } catch (error) {
      console.error("Narrator | Error loading fonts:", error);
    }
  }

  /**
   * Helper to load a set of fonts
   */
  private async loadFontSet(fonts: string[]): Promise<void> {
    // Implement with your FontsLoader
    // Example implementation:
    return new Promise((resolve) => {
      // Mock implementation - replace with your actual font loading code
      setTimeout(resolve, 100);
    });
  }

  /**
   * Display narrator text on screen
   */
  public async displayText(text: string, options: NarratorTextOptions = {}): Promise<void> {
    if (!this.ready) {
      console.warn("Narrator | System not ready yet");
      return;
    }

    if (!this.container) {
      console.error("Narrator | Container not initialized");
      return;
    }

    // Clear any existing display
    this.container.removeChildren();

    // Default options
    const {
      duration = 5000,
      fontSize = 48,
      fontColor = '#ffffff',
      backgroundColor = '#000000',
      opacity = 0.8,
      fontFamily = this.titleFont,
      fontWeight = this.titleWeight,
      fontStyle = 'normal',
      textAlign = 'center',
      wordWrap = true,
      wordWrapWidth = canvas?.dimensions?.width ? canvas?.dimensions.width * 0.8 : window.innerWidth * 0.8,
      animation = {
        duration: 1000,
        easing: 'easeOutQuad',
        initialScale: 0.5,
        finalScale: 1.2,
        initialAlpha: 0,
        finalAlpha: 1
      }
    } = options;

    // Create background overlay
    const overlay = new PIXI.smooth.Graphics();
    overlay.beginFill(Number.parseInt(backgroundColor.replace('#', '0x')));
    overlay.drawRect(0, 0, canvas?.dimensions?.width || window.innerWidth, canvas?.dimensions?.height || window.innerHeight);
    overlay.endFill();
    overlay.alpha = opacity;
    this.container.addChild(overlay);

    // Create text
    const style = new PIXI.TextStyle({
      fontFamily: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      fill: fontColor,
      align: textAlign,
      wordWrap: wordWrap,
      wordWrapWidth: wordWrapWidth
    });

    const textObject = new PIXI.Text(text, style);
    textObject.anchor.set(0.5, 0.5);
    textObject.position.set(
      canvas?.dimensions?.width ? canvas?.dimensions.width / 2 : window.innerWidth / 2,
      canvas?.dimensions?.height ? canvas?.dimensions.height / 2 : window.innerHeight / 2
    );
    
    // Set initial animation state
    textObject.scale.set(animation.initialScale!, animation.initialScale!);
    textObject.alpha = animation.initialAlpha!;
    
    this.container.addChild(textObject);

    // Animate in
    const animateIn = () => {
      return new Promise<void>(resolve => {
        // Use Foundry's canvas animation system for compatibility
        // Note: This is different from the PIXI Animation in your original code
        canvas?.app?.ticker.add(function animate(delta) {
          const t = Math.min(1, this.t + (delta / 60));
          
          // Apply easing (simplified easeOutQuad)
          const easedT = 1 - (1 - t) ** 2;
          
          // Update scale and alpha
          const scale = animation.initialScale! + (animation.finalScale! - animation.initialScale!) * easedT;
          const alpha = animation.initialAlpha! + (animation.finalAlpha! - animation.initialAlpha!) * easedT;
          
          textObject.scale.set(scale, scale);
          textObject.alpha = alpha;
          
          this.t = t;
          if (t >= 1) {
            canvas?.app?.ticker.remove(animate);
            resolve();
          }
        }.bind({ t: 0 }));
      });
    };

    // Animate out
    const animateOut = () => {
      return new Promise<void>(resolve => {
        canvas?.app?.ticker.add(function animate(delta) {
          const t = Math.min(1, this.t + (delta / 60));
          
          // Apply easing (simplified easeInQuad)
          const easedT = t * t;
          
          // Update alpha only for fade out
          const alpha = animation.finalAlpha! - (animation.finalAlpha! * easedT);
          textObject.alpha = alpha;
          overlay.alpha = opacity - (opacity * easedT);
          
          this.t = t;
          if (t >= 1) {
            canvas?.app?.ticker.remove(animate);
            resolve();
          }
        }.bind({ t: 0 }));
      });
    };

    // Execute the sequence
    await animateIn();
    
    // Hold for display duration minus animation time
    await new Promise(resolve => setTimeout(resolve, duration - animation.duration!));
    
    await animateOut();
    
    // Clean up
    this.container.removeChildren();
  }

  /**
   * Display a title with subtitle
   */
  public async displayTitle(title: string, subtitle?: string, options: NarratorTextOptions = {}): Promise<void> {
    // Adjust font sizes for title/subtitle
    const titleOptions = {
      ...options,
      fontSize: options.fontSize || 72,
      fontFamily: options.fontFamily || this.titleFont,
      fontWeight: options.fontWeight || this.titleWeight
    };
    
    // Combine title and subtitle with formatting
    let displayText = title;
    if (subtitle) {
      displayText = `${title}\n\n${subtitle}`;
    }
    
    await this.displayText(displayText, titleOptions);
  }
}
