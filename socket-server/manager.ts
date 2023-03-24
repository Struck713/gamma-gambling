import { Crash, Games, Roulette, Slots } from "./games";
import { Game, Player } from "./models";
import { Nullable } from "./utils";

/**
 * GameManager
 * 
 * Contains a list of games and utility
 * functions that can be used on that list.
 * 
 * For example: Finding a player in a game,
 * or create a new game
 */
export default class GameManager {

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
    join = (player: Player, name: Games) => {
        for (let game of this.games) {
            if (game.type == name) {
                if (game.join(player)) return true;
            }
        }
        
        let createdGame: Nullable<Game> = this.create(name);
        if (!createdGame) return;
        createdGame.join(player);
        this.games.push(createdGame);
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
        switch (name) {
            case Games.Roulette: return new Roulette();
            case Games.Crash: return new Crash();
            case Games.Slots: return new Slots();
        }
    } 

}