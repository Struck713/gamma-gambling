import { Crash, Roulette, Slots } from "./games";
import { Game, Player } from "./models";
import { Nullable } from "./utils";

export default class GameManager {

    games: Game[];

    constructor() {
        this.games = [];
    }

    // have a player join a game based on the game name
    join = (player: Player, name: string) => {
        // search all games
        for (let game of this.games) {
            // if the game of that name has an open lobby, we join it
            // else search all of the games
            if (game.name == name) {
                if (game.join(player)) return true;
            }
        }

        // if we have made it to this part of the code, we have not found an empty lobby
        let createdGame: Nullable<Game> = this.create(name);
        if (!createdGame) return;
        createdGame.join(player);
        this.games.push(createdGame);
    }

    create = (name: String): Nullable<Game> => {
        let created: Nullable<Game> = null;
        switch (name) {
            case "Roulette": created = new Roulette();
            case "Crash": created = new Crash();
            case "Slots": created = new Slots();
        }
        return created;
    }

}