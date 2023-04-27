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

    id: number;
    game: string;
    date_of: Date;

}

interface GameHistoryPlayer {

    username: string;
    game: string;
    date_of: Date;

}

interface Leader {

    position: number;
    username: string;
    total: number;

}


export type { Account, Leader, Transaction, GameHistory, GameHistoryPlayer };