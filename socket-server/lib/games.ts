import { Game } from './models'

/**
 * Roulette
 * 
 * The concrete implementation of the Roulette
 * game type.
 */
class Roulette extends Game {

    constructor(id: number) {
        super(id, Games.Roulette, 2, 16);
    }

    update() {

    }

    end() {
        
    }

}

/**
 * Slots
 * 
 * The concrete implementation of the Slots
 * game type.
 */
class Slots extends Game {

    constructor(id: number) {
        super(id, Games.Slots, 2, 16);
    }

    update() {

    }

    end() {
        
    }

}

/**
 * Crash
 * 
 * The concrete implementation of the Crash
 * game type.
 */
class Crash extends Game {

    constructor(id: number) {
        super(id, Games.Crash, 2, 16);
    }

    update() {

    }

    end() {
        
    }

}

class Test extends Game {

    constructor(id: number) {
        super(id, Games.Test, 2, 16);
    }

    update() {

    }

    end() {
        
    }

}

/**
 * Games
 * 
 * This enum just contains a list
 * of the possible types of Game
 */
enum Games {

    Roulette = "Roulette",
    Slots = "Slots",
    Crash = "Crash",
    Test = "Test"

}

export { Games, Roulette, Slots, Crash, Test };