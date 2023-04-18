
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
    win_amt: number, 
    loss_amt: number, 
    reason: string, 
    game_id: number, 
    date_changed: Date

}

export type { Account, Transaction };