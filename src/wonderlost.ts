import consola from 'consola';
import { Toasted } from "./submodules/toasted/Toasted";
import { Narrator } from './submodules/narrator/Narrator';

type ToastedTuple = ['Toasted', typeof Toasted];
type NarratorTuple = ['Narrator', typeof Narrator];

class Wonderlost {
	public tomes = new Map<
		"Toasted" | "Narrator",
		typeof Toasted | typeof Narrator
	>([
		["Toasted", Toasted] as ToastedTuple,
		["Narrator", Narrator] as NarratorTuple,
	]);

	constructor(public DEBUG = false) {
		this.DEBUG = DEBUG;
		if (this.DEBUG) {
			consola.info("Wonderlost | Initialized", { self: this });
		}
	}

	initializeTomes() {
		for (const [tomeName, Tome] of this.tomes) {
			new Tome(this.DEBUG).initialize();

			if (this.DEBUG) {
				consola.info(`Wonderlost | Initialized ${tomeName}`, {
					Tome: Tome.prototype.toJSON(),
				});
			}
		}
	}

	getModule(moduleName: string) {
		return this.tomes.get(moduleName as "Toasted" | "Narrator");
	}


	moduleExists(moduleName: string): boolean {
		return this.tomes.has(moduleName as "Toasted" | "Narrator");
	}
}

const wonderlost = new Wonderlost(true);

Hooks.once("setup", () => {
  console.log("Wonderlost | Setup started");
  wonderlost.initializeTomes();
  console.log("Wonderlost | Ready");
  
  // Make API available globally for other modules
  // @ts-ignore
  game.modules.get("wonderlost").api = wonderlost;
});

export default wonderlost;

