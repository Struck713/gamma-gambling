import { Socket } from "socket.io";
import { Crash, Games, Roulette, Slots } from "./games";
import { Game, Player } from "./models";
import { Nullable, Undefineable } from "../utils";

import env from '../env.json';
import jwt from "jsonwebtoken";
import { gameManager } from "..";

/**
 * GameManager
 * 
 * Contains a list of games and utility
 * functions that can be used on that list.
 * 
 * For example: Finding a player in a game,
 * or create a new game
 */
class GameManager {

    games: Game[];

    constructor() {
        this.games = [];
    }

    /**
     * Attempts to find an open game lobby
     * with that type, if it can't, it will
     * create a new one and add the player to
     * it.
     * 
     * @param player the player to join
     * @param name the name of the Game
     * @returns
     */
    join = (player: Player, name: Games): Nullable<Game> => {
        for (let game of this.games) {
            if (game.type == name) {
                game.join(player);
                return game;
            }
        }
        
        let createdGame: Nullable<Game> = this.create(name);
        if (!createdGame) return null;

        createdGame.join(player);
        this.games.push(createdGame);
        return createdGame;
    }

    /**
     * Searches all of the games to find the player
     * we are looking for
     * 
     * @param player the player we want to find
     * @returns the Game the player is in or null
     */
    find = (player: Player): Nullable<Game> => {
        for (let game of this.games) {
            if (game.players.includes(player)) return game;
        }
        return null;
    }

    /**
     * Creates a new instance of game based
     * on it's name.
     * 
     * @param name the name of the Game
     * @returns 
     */
    create = (name: Games): Nullable<Game> => {
        let nextId = this.games.length + 1;
        switch (name) {
            case Games.Roulette: return new Roulette(nextId);
            case Games.Crash: return new Crash(nextId);
            case Games.Slots: return new Slots(nextId);
        }
    } 

}

class PlayerManager {

    players: WeakMap<Socket, Player>;

    constructor() {
        this.players = new WeakMap();
    }

    // authenticate a socket
    authenticate = async (socket: Socket): Promise<Player | Error> => {
        let data = socket.handshake.auth.token as string;
        try {
            if (await jwt.verify(data, env.token)) {
                let payload = await jwt.decode(data);
                if (payload) return payload as Player;
            }
        } catch (e) {
            return new Error("Invalid token");
        }
        return new Error("Not authorized");
    }

    // setup socket listeners
    register = (socket: Socket, player: Player): void => { 
        socket.on("status", () => {
            let game: Nullable<Game> = gameManager.find(player);
            if (game) socket.emit("status", { players: game.players.map(player => player.username), max: game.max });
        });
        this.players.set(socket, player) 
    };

    deregister = (socket: Socket): void => {
        let player: Player = this.get(socket);
        let game: Nullable<Game> = gameManager.find(player);
        if (game) game.leave(player);
        this.players.delete(socket);
    }

    get = (socket: Socket): Player => this.players.get(socket)!;

}

export { GameManager, PlayerManager };