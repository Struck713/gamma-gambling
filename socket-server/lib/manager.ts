import { Socket } from "socket.io";
import { RocketRide, Games, Roulette, Slots } from "./games";
import { Game, GameState, Player } from "./models";
import { Nullable } from "../utils";

import env from '../env.json';
import jwt from "jsonwebtoken";
import { gameManager, playerManager } from "..";

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
    tasks: NodeJS.Timer[];

    constructor() {
        this.games = [];
        this.tasks = [];
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
    join = (socket: Socket, name: Games): Nullable<Game> => {
        let player: Player = playerManager.get(socket);
        for (let game of this.games) {
            if (game.type == name && game.join(socket, player)) return game;
        }
        
        let createdGame: Nullable<Game> = this.create(name);
        if (!createdGame) return null;

        createdGame.join(socket, player);
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
        let game: Game;
        switch (name) {
            case Games.Roulette: game = new Roulette(nextId); break;
            case Games.RocketRide: game = new RocketRide(nextId); break;
            case Games.Slots: game = new Slots(nextId); break;
        }

        this.tasks.push(setInterval(gameManager.update, 100, game));
        return game;
    } 

    update(game: Game) {

        if (game.state != GameState.Started) {

            if (game.state == GameState.Waiting) {
                // ensure player count is met
                game.time = 150;
                if (game.players.length >= game.min) game.setState(GameState.Lobby);
            }
    
            if (game.state == GameState.Lobby) {
                // ensure player count is met
                if (game.players.length < game.min) {
                    game.setState(GameState.Waiting);
                    return;
                }
    
                game.broadcastTick({ time: (game.time / 10) });
                game.time--;
                if (game.time <= 0) {
                    game.setState(GameState.Started);
                    game.start();
                }
            }
    
            if (game.state == GameState.Ended) {
                game.broadcastTick({ time: (game.time / 10) });
                game.end();
                game.payout();
                game.setState(GameState.Post);
                game.time = 100; 
            }
    
            if (game.state == GameState.Post) {
                game.time--;
                if (game.time <= 0) {
                    game.time = 150;
                    game.setState(GameState.Lobby);
                    game.reset();

                    game.broadcastStatus();
                }
            }

            return;
        }

        game.update();
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
        this.players.set(socket, player) 
    };

    deregister = (socket: Socket): void => {
        let player: Player = this.get(socket);
        let game: Nullable<Game> = gameManager.find(player);
        if (game) game.leave(socket, player);
        this.players.delete(socket);
    }

    get = (socket: Socket): Player => this.players.get(socket)!;

}

export { GameManager, PlayerManager };