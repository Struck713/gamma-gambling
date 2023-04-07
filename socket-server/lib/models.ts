import { Socket } from "socket.io";
import { io } from "..";
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

    id: number;
    type: Games;
    min: number;
    max: number;
    players: Player[];
    state: GameState;

    constructor(id: number, type: Games, min: number, max: number) {
        this.id = id;
        this.type = type;
        this.min = min;
        this.max = max;
        this.players = [];
        this.state = GameState.Waiting;
    }

    /**
     * Invoked to make a player join
     * this game instance.
     * 
     * @param player the player who is joining
     * @returns true if the player successfully joins
     *          false if the lobby is full
     */
    join(socket: Socket, player: Player) {
        if (this.players.length >= this.max) return false;
        
        this.players.push(player);

        socket.join(this.getName());
        this.status();
        console.log(`[${this.type}] [Lobby ${this.id}] ${player.username} joined.`);
        return true;
    }

    /**
     * Invoked to make a player leave
     * this game instance.
     * 
     * @param player the player who is leaving
     * @returns true if the player successfully leaves
     *          false if the player was not in the lobby
     */
    leave(socket: Socket, player: Player) {
        let found: number = this.players.indexOf(player);
        if (found == -1) return false;
        this.players.splice(found, 1);

        socket.leave(this.getName());
        this.status();
        console.log(`[${this.type}] [Lobby ${this.id}] ${player.username} left.`)
        return true;
    }

    /**
     * This function is called once upon game
     * start. It can be used to setup concrete
     * class variables and other stuff not offered
     * in this abstraction.
     * 
     * @returns
     */
    start() {}

    /**
     * This function is called for each second
     * that the game is running, it can modify
     * game data sent to players or the game's
     * internal state. 
     * 
     * @returns
     */
    update() {}

    /**
     * This function is called when the game ends.
     * Usually a winner will be chosen during this
     * function call.
     * 
     * @returns
     */
    end() {}

    status = () => this.broadcast("status", { players: this.players.map(player => player.username), max: this.max });
    broadcast = (event: string, data: any) => io.in(this.getName()).emit(event, data);
    getName = () => `${this.type}-${this.id}`

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
interface Player {

    id: string;
    username: string;
    iat: number;
    exp: number;

}

/**
 * Game State
 * 
 * All of the possible game states:
 * - Started: The game is currently running
 * - Ended:   The game is in the end position, 
 *            a winner is being picked or has
 *            been picked
 * - Waiting: The game is waiting for other
 *            players to join
 */
enum GameState {

    Started,
    Ended,
    Waiting,

}

export { Game, Player, GameState };