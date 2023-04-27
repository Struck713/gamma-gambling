interface Account {

    id: number;
    email: string;
    username: string;
    password_hash?: string;

}

interface Transaction {

    id: number, 
    total: number, 
    bet_amt: number, 
    return_amt: number,  
    reason: string, 
    game_id: number, 
    date_changed: Date

}

interface GameHistory {

    name: string;
    date_of: Date;
    players: GameHistoryPlayer[];

}

interface GameHistoryPlayer {

    username: string;
    betAmount: number;
    returnAmount: number;

}

interface Leader {

    position: number;
    username: string;
    total: number;

}


export type { Account, Leader, Transaction, GameHistory, GameHistoryPlayer };