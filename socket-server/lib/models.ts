import { Socket } from "socket.io";
import { io } from "..";
import { Games } from "./games";
import { Callback, Undefineable } from "../utils";
import { execute } from "./db";
import { Webhook } from "./webhook";
import { OkPacket } from "mysql";

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
abstract class Game {

    readonly id: number;
    readonly type: Games;
    readonly min: number;
    readonly max: number;
    state: GameState;

    time: number;
    players: Player[];
    winners: Winner[];

    listeners: Map<string, Callback<Socket, Player, any>>;

    constructor(id: number, type: Games, min: number, max: number) {
        this.id = id;
        this.type = type;
        this.min = min;
        this.max = max;

        this.listeners = new Map;
        this.players = [];
        this.winners = [];
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

        for (let listener of this.listeners.keys()) {
            socket.on(listener, (data: any) => {
                let callback = this.listeners.get(listener);
                if (callback) callback(socket, player, data);
            })
        }

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

    /**
     * This function is called once upon game
     * start. It can be used to setup concrete
     * class variables and other stuff not offered
     * in this abstraction.
     * 
     * @returns
     */
    abstract start(): void;

    /**
     * This function is called for each second
     * that the game is running, it can modify
     * game data sent to players or the game's
     * internal state. 
     * 
     * @returns
     */
    abstract update(): void;

    /**
     * This function is called when the game ends.
     * Usually a winner will be chosen during this
     * function call.
     * 
     * @returns
     */
    abstract end(): void;

    /**
     * Pays out the winners and losers. (yep!)
     * This also sends a webhook to the Discord channel.
     */
    async payout() {
        let fields: Webhook.Field[] = [];
        let payout: Payout[] = [];
        this.players.forEach(player => {
            if (player.bet == 0) return;

            let winner = this.winners.find(value => value.id == player.id);
            let returnAmount = winner ? winner.value : -player.bet;

            player.total = player.total + returnAmount;
            payout.push({ id: player.id, bet: player.bet, total: player.total, returnAmount, reason: this.type.toUpperCase() });
            fields.push({ name: player.username, value: returnAmount.toString(), inline: true });
        });

        let id = await this.createGameHistory();
        payout.forEach(payout => this.createTransaction(id, payout));
        Webhook.sendStatusMessage(this.type, this.getName(), id, fields);
    }

    /**
     * Resets the players bets and winners list.
     * This also broadcasts a reset message and a status message.
     */
    reset() {
        // reset bets
        this.players.forEach(player => player.bet = 0);
        this.winners = [];

        this.broadcast("reset");
        this.broadcastStatus();
        this.log("Reset all players.");
    }

    /**
     * This function allows a game creator
     * to override the status object sent to
     * the client.
     * 
     * @param player the Player
     * @returns A status object
     */
    getStatus(player: Player): any {
        return { data: player.bet ?? 0 };
    }

    private createTransaction = async (gameHistoryId: number, payout: Payout) => {
        let { insertId } = await execute<OkPacket>("INSERT INTO user_transaction (account_id, total, bet_amt, return_amt, reason) VALUES (?, ?, ?, ?, ?)", payout.id, payout.total, payout.bet, payout.returnAmount, payout.reason);
        await execute("INSERT INTO game_history_players (account_id, game_history_id, user_transaction_id) VALUES (?, ?, ?)", payout.id, gameHistoryId, insertId);
    }

    private createGameHistory = async (): Promise<number> => {
        let { insertId } = await execute<OkPacket>("INSERT INTO game_history (game) VALUES (?)", this.getName());
        return insertId;
    };

    broadcastTick = (data: any) => this.broadcast("tick", { data, state: this.state });
    broadcastStatus = () => this.broadcast("status", { players: this.players.map(player => { return { id: player.id, username: player.username, ...this.getStatus(player) } }), max: this.max });
    broadcast = (event: string, data?: any): boolean => io.in(this.getName()).emit(event, data);
    error = (socket: Socket, message: string): boolean => socket.emit("game_error", message);
    
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
    total: number;
    bet: number;
    iat: number;
    exp: number;

}

interface Winner {

    id: number;
    username: string;
    value: number;

}

interface Payout {

    id: number;
    bet: number;
    total: number;
    returnAmount: number;
    reason: string;

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