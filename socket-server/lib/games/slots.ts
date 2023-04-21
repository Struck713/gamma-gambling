import { Games } from ".";
import { Game } from "../models";

/**
 * Slots
 * 
 * The concrete implementation of the Slots
 * game type.
 */
export default class Slots extends Game {

    constructor(id: number) {
        super(id, Games.Slots, 2, 16);
    }

    start() {
        
    }

    update() {

    }

    end() {
        
    }

}