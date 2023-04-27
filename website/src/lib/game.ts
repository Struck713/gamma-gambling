namespace Game {

    export enum State {

        Waiting = "Waiting",
        Started = "Started",
        Lobby = "Lobby",
        Ended = "Ended",
        Post = "Post"
    
    }

    export interface Status {

        players: PlayerStatus[];
        max: number;
    
    }

    export interface Tick {

        data: any;
        state: Game.State;
    
    }

    export const SERVER_URL = "http://localhost:3001";

}

interface PlayerStatus {

    id: number;
    username: string;
    data: any;

}

export type { PlayerStatus };
export { Game };