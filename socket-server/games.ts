import { Game } from './models'

class Roulette extends Game {

    constructor() {
        super(Games.Roulette, 2, 16);
    }

    update() {

    }

    end() {
        
    }

}

class Slots extends Game {

    constructor() {
        super(Games.Slots, 2, 16);
    }

    update() {

    }

    end() {
        
    }

}

class Crash extends Game {

    constructor() {
        super(Games.Crash, 2, 16);
    }

    update() {

    }

    end() {
        
    }

}

enum Games {

    Roulette,
    Slots,
    Crash

}

export { Games, Roulette, Slots, Crash };