import { Games } from ".";
import { Game } from "../models";

/**
 * Roulette
 * 
 * The concrete implementation of the Roulette
 * game type.
 */
export default class Roulette extends Game {

    constructor(id: number) {
        super(id, Games.Roulette, 2, 16);
    }

    start() {
        
    }

    update() {

    }

    end() {
        
    }

}