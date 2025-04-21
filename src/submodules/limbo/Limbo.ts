import { Tome } from 'src/class/Tome';
import type { SceneCreator } from '../scenery/SceneCreator';
import consola from 'consola';

export class Limbo extends Tome {
  private sceneryInstance: SceneCreator | undefined;

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
            const newScene = await this.sceneryInstance.createScene({
              name: 'Example Scene',
              width: 1500,
              height: 1500,
            });

            if (this.DEBUG) {
              consola.info('Limbo | Created new scene via dependency', newScene);
            }

            this.ready = true;
          },
        ],
      ],
    });
  }
}
