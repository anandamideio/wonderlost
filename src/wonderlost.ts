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
			consola.info("Wonderlost | Initialized", this);
		}
	}

	initializeTomes() {
		for (const [tomeName, Tome] of this.tomes) {
			new Tome(this.DEBUG).initialize();

			if (this.DEBUG) {
				consola.info(`Wonderlost | Initialized ${tomeName}`, Tome);
			}
		}
	}
}

Hooks.once("setup", async () => {
	consola.start("Wonderlost | Initialized");
	new Wonderlost(true).initializeTomes();
	consola.success("Wonderlost | Ready");
});

// Hooks.once("ready", async function () { });

