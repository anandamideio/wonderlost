import consola from 'consola';
import { Tome } from 'src/class/Tome';

export class SceneCreator extends Tome {
  constructor(DEBUG = false) {
    super({
      moduleName: 'Scenery',
      moduleDescription: 'A module for creating and managing scenes',
      DEBUG,
      hooks: [
        [
          'ready',
          async () => {
            // You can initialize scene-related features here
              console.log('SceneCreator | Ready');
          },
        ],
      ],
    });
  }

  /**
   * Create a new scene
   * @param {Partial<SceneData>} sceneData The scene data
   * @returns Promise with the created scene
   */
  async createScene(sceneData: Partial<SceneData>) {
    try {
      // Ensure required data is present
      const requiredData = {
        name: sceneData.name || `New Scene ${Date.now()}`,
        // Set defaults for other required properties
        width: sceneData.width || 2000,
        height: sceneData.height || 2000,
        // You can add more default values as needed
      };

      // Merge with user-provided data
      const finalData = { ...requiredData, ...sceneData };

      // Create the scene
      const createdScene = await Scene.create(finalData);

      if (this.DEBUG) {
        consola.log('SceneCreator | Created scene', createdScene);
      }

      return createdScene;
    } catch (error) {
      consola.error('SceneCreator | Error creating scene', error);
      return null;
    }
  }

  /**
   * Create a scene and activate it
   * @param {Partial<SceneData>} sceneData The scene data
   * @returns Promise with the activated scene
   */
  async createAndActivateScene(sceneData: Partial<SceneData>) {
    const scene = await this.createScene(sceneData);
    if (scene) {
      await scene.activate();
    }
    return scene;
  }
}
