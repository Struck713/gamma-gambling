import { Games } from "./games";

/**
 * Game
 * 
 * Super class of all game instances, keeps code
 * looking nice and tidy.
 * 
 * Base class just contains
 * a name, a min amount of players and a max amount
 * of players. 
 * These values are all for the GameManager.
 */
class Game {

    type: Games;
    min: number;
    max: number;

    players: Player[];

    constructor(type: Games, min: number, max: number) {
        this.type = type;
        this.min = min;
        this.max = max;
        this.players = [];
    }

    join(player: Player) {
        if (this.players.length + 1 > this.max) return false;
        this.players.push(player);
        return true;
    }

    leave(player: Player) {
        let found: number = this.players.indexOf(player);
        if (found == -1) return false;
        this.players.splice(found, 1);
        return true;
    }

    update() {}
    end() {}

}

/**
 * Player
 * 
 * This class has an ID (user ID) and
 * a name (username of player). The name
 * will mostly be for displaying to other
 * users who is in the lobby. 
 * 
 * All operations for Player should be done
 * using ID.
 */
class Player {

    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

}

export { Game, Player };