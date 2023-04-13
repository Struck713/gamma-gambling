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

    readonly id: number;
    readonly type: Games;
    readonly min: number;
    readonly max: number;
    state: GameState;

    time: number;
    players: Player[];

    constructor(id: number, type: Games, min: number, max: number) {
        this.id = id;
        this.type = type;
        this.min = min;
        this.max = max;
        this.players = [];
        this.state = GameState.Waiting;

        this.time = 150;
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
        this.broadcastStatus();

        this.log(`${player.username} joined.`);
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
        this.broadcastStatus();

        this.log(`${player.username} left.`);
        return true;
    }

    optIn(player: Player, amount: number) {
        if (this.state == GameState.Started) return;

        player.bet = amount;
        this.log(`${player.username} opted-in for ${amount}.`);
        this.broadcastStatus();
    }

    optOut(player: Player) {
        if (this.state == GameState.Started) return;

        player.bet = 0;
        this.log(`${player.username} opted-out.`);
        this.broadcastStatus();
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

    reset = () => {
        // reset bets
        this.players.forEach(player => player.bet = 0);
        this.broadcast("opt", { confirmed: false });
        this.broadcastStatus();
        this.log("Reset all players.");
    }

    broadcastTick = (data: any) => this.broadcast("tick", { data, state: this.state });
    broadcastStatus = () => this.broadcast("status", { players: this.players.map(player => { return { id: player.id, username: player.username, bet: player.bet ?? 0 } }), max: this.max });
    broadcast = (event: string, data: any): boolean => io.in(this.getName()).emit(event, data);
    
    setState = (state: GameState) => { this.state = state; this.log(`Changed state to '${state}'`);}
    log = (message: string) => console.log(`[${this.type}] [Lobby ${this.id}] ${message}`);
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

    id: number;
    username: string;
    bet: number;
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

    Waiting = "Waiting",
    Started = "Started",
    Lobby = "Lobby",
    Ended = "Ended",
    Post = "Post"

}

export { Game, Player, GameState };