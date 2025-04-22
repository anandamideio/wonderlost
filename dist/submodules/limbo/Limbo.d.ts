import { Tome } from 'src/class/Tome';
export declare class Limbo extends Tome {
    private sceneryInstance;
    private playerWaitingScreen;
    private readonly waitingRoomName;
    constructor(DEBUG?: boolean);
    /**
     * Find an existing waiting room scene or create a new one
     */
    private findOrCreateWaitingRoom;
    /**
     * Activate the waiting room scene for all players
     */
    activateWaitingRoom(): Promise<boolean>;
}
//# sourceMappingURL=Limbo.d.ts.map