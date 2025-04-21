import { Tome } from 'src/class/Tome';
export declare class SceneCreator extends Tome {
    constructor(DEBUG?: boolean);
    /**
     * Create a new scene
     * @param {Partial<SceneData>} sceneData The scene data
     * @returns Promise with the created scene
     */
    createScene(sceneData: Partial<SceneData>): Promise<import("../../types/types/utils.mjs").ConfiguredStoredDocument<typeof Scene> | null | undefined>;
    /**
     * Create a scene and activate it
     * @param {Partial<SceneData>} sceneData The scene data
     * @returns Promise with the activated scene
     */
    createAndActivateScene(sceneData: Partial<SceneData>): Promise<import("../../types/types/utils.mjs").ConfiguredStoredDocument<typeof Scene> | null | undefined>;
}
//# sourceMappingURL=SceneCreator.d.ts.map