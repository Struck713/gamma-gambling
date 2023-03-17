class Game {

    name: string;
    min: number;
    max: number;

    players: Player[];

    constructor(name: string, min: number, max: number) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.players = [];
    }

    join(player: Player) {
        if (this.players.length + 1 > this.max) return false;
        this.players.push(player);
        return true;
    }

    leave(player: Player) {
        let found: number = this.players.indexOf(player);
        if (found == -1) return false;
        this.players.splice(found, 1);
        return true;
    }

    update() {}
    end() {}

}

class Player {

    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

}

export { Game, Player };