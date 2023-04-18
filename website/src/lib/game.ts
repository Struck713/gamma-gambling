import { toast } from "react-hot-toast";
import { Socket, io } from "socket.io-client";

namespace Game {

    export enum State {

        Waiting = "Waiting",
        Started = "Started",
        Lobby = "Lobby",
        Ended = "Ended",
        Post = "Post"
    
    }

    export interface Status {

        players?: PlayerStatus[];
        max?: number;
    
    }

    export interface Tick {

        data?: any;
        state?: Game.State;
    
    }

}

interface PlayerStatus {

    id: number;
    username: string;
    bet: number;

}

export type { PlayerStatus };
export { Game };