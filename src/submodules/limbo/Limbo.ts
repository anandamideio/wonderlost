import { Tome } from 'src/class/Tome';
import type { SceneCreator } from '../scenery/SceneCreator';
import consola from 'consola';
import type { ConfiguredStoredDocument } from 'src/types/types/utils.mjs';

export class Limbo extends Tome {
  private sceneryInstance: SceneCreator | undefined;
  private playerWaitingScreen: ConfiguredStoredDocument<typeof Scene> | null | undefined;

  constructor(DEBUG = false) {
    super({
      moduleName: 'Limbo',
      moduleDescription: 'A waiting room for your players while you plan the game',
      DEBUG,
      dependencies: ['Scenery'],
      hooks: [
        [
          'ready',
          async () => {
            // You can initialize tome-related features here
            if (this.DEBUG) console.log('Limbo | Ready');

            this.sceneryInstance = this.getTome<SceneCreator>('Scenery');

            if (!this.sceneryInstance) {
              console.error('Limbo | Scenery instance not found');
              return;
            }

            // Now we can use sceneryInstance's methods
            this.playerWaitingScreen = await this.sceneryInstance.createScene({
              name: 'Example Scene',
              width: 2000,
              height: 2000,
            });

            if (this.DEBUG) {
              consola.info('Limbo | Created new scene via dependency', this.playerWaitingScreen);
            }

            this.ready = true;
          },
        ],
        [
          'getSceneControlButtons',
          (controls) => {
            if (this.DEBUG) {
              consola.info('Limbo | Adding scene control buttons', controls);
            }

            const notesControl = controls.find((c) => c.name === 'notes');

            if (notesControl) {
              consola.info('Limbo | Found notes control', notesControl);

              notesControl.tools.push({
                name: 'limbo',
                title: 'In Limbo?',
                icon: 'fas fa-door-open',
                button: true,
                onClick: () => this.activateWaitingRoom(),
                visible: game.user?.isGM, // Only show to GM
              });
            } else {
              consola.warn('Limbo | Notes control not found');
            }

            return controls;
          },
        ],
      ],
    });
  }

  public async activateWaitingRoom() {
    if (!this.playerWaitingScreen) {
      consola.error('Limbo | Waiting room not created');
      return;
    }

    try {
      // Activate the waiting room scene
      await this.playerWaitingScreen.activate();

      if (this.DEBUG) {
        consola.info('Limbo | Activated waiting room', this.playerWaitingScreen);
      }

      return true;
    } catch (error) {
      consola.error('Limbo | Error activating waiting room', error);
      return false;
    }
  }
}
