import { Tome } from '@anandamideio/tome';
import consola from 'consola';
import type { ConfiguredStoredDocument } from 'src/types/types/utils.mjs';
import type { SceneCreator } from '../scenery/SceneCreator';

export class Limbo extends Tome {
  private sceneryInstance: SceneCreator | undefined;
  private playerWaitingScreen: ConfiguredStoredDocument<typeof Scene> | null | undefined;
  private readonly waitingRoomName: string = 'Limbo';

  constructor(DEBUG = false) {
    super({
      moduleName: 'Limbo',
      moduleDescription: 'A waiting room for your players while you plan the game',
      namespace: 'wonderlost',
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

            await this.findOrCreateWaitingRoom();
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
              if (this.DEBUG) {
                consola.info('Limbo | Found notes control', notesControl);
              }

              // Add our limbo button to the notes control panel
              notesControl.tools.push({
                name: 'limbo',
                title: 'Send Players to Limbo',
                icon: 'fas fa-door-open',
                button: true,
                onClick: () => {
                  if (this.DEBUG) {
                    consola.info('Limbo | Button clicked, activating waiting room');
                  }
                  this.activateWaitingRoom();
                },
                visible: game.user?.isGM, // Only show to GM
              });
            } else {
              consola.warn('Limbo | Notes control not found');
            }

            return;
          },
        ],
      ],
    });
  }

  /**
   * Find an existing waiting room scene or create a new one
   */
  private async findOrCreateWaitingRoom(): Promise<void> {
    try {
      // Check if a scene with this name already exists
      const existingScene = game.scenes?.find((scene) => scene.name === this.waitingRoomName);

      if (existingScene) {
        if (this.DEBUG) {
          consola.info(`Limbo | Found existing waiting room scene "${this.waitingRoomName}"`, existingScene);
        }
        this.playerWaitingScreen = existingScene;
      } else {
        // Create a new waiting room scene if one doesn't exist
        if (this.DEBUG) {
          consola.info(`Limbo | Creating new waiting room scene "${this.waitingRoomName}"`);
        }

        this.playerWaitingScreen = await this.sceneryInstance?.createScene({
          name: this.waitingRoomName,
          width: 2000,
          height: 2000,
          navigation: true,
          navName: 'Limbo',
        });

        if (this.DEBUG && this.playerWaitingScreen) {
          consola.success('Limbo | Created new waiting room scene', this.playerWaitingScreen);
        }
      }
    } catch (error) {
      consola.error('Limbo | Error setting up waiting room scene', error);
      this.playerWaitingScreen = null;
    }
  }

  /**
   * Activate the waiting room scene for all players
   */
  public async activateWaitingRoom() {
    // Ensure we have a waiting room first
    if (!this.playerWaitingScreen) {
      consola.warn('Limbo | Waiting room not found, attempting to create one...');
      await this.findOrCreateWaitingRoom();

      // If we still don't have a waiting room, return
      if (!this.playerWaitingScreen) {
        consola.error('Limbo | Failed to create waiting room scene');
        return false;
      }
    }

    try {
      // Activate the waiting room scene
      await this.playerWaitingScreen.activate();

      if (this.DEBUG) {
        consola.success('Limbo | Activated waiting room', this.playerWaitingScreen);
      }

      // Notify players they've been sent to Limbo
      const message = 'Players have been sent to Limbo waiting room.';
      game.socket?.emit('module.toasted', message);

      // Also send a notification to the GM
      ui.notifications?.info(message);

      return true;
    } catch (error) {
      consola.error('Limbo | Error activating waiting room', error);
      return false;
    }
  }
}
