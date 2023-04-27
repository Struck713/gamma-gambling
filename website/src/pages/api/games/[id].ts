import auths from "@/lib/auth";
import { ncOpts } from "@/lib/constants";
import { execute } from "@/lib/db";
import { GameHistory, GameHistoryPlayer } from "@/lib/models";
import { NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc(ncOpts);
handler.use(...auths);

handler.get<any, NextApiResponse>(async (req, res) => {
    const { id } = req.query;
    const [ gameHistory ] = await execute<{ id: number, game: string, date_of: Date }>("SELECT * FROM game_history WHERE id=?", id) ?? [];
    if (!gameHistory) {
        res.status(200).json({ message: "Invalid request." });
        return;
    }

    const [ totals ] = await execute<{ totalBet: number, totalReturn: number }>("SELECT SUM(ut.bet_amt) as totalBet, SUM(ut.return_amt) as totalReturn FROM game_history_players AS ghp JOIN user_transaction AS ut ON ut.id=ghp.user_transaction_id JOIN account ON ut.account_id=account.id WHERE game_history_id=?", gameHistory.id) ?? [];
    const gameHistoryPlayers = await execute<GameHistoryPlayer>("SELECT account.username, ut.bet_amt as betAmount, ut.return_amt as returnAmount FROM game_history_players AS ghp JOIN user_transaction AS ut ON ut.id=ghp.user_transaction_id JOIN account ON ut.account_id=account.id WHERE game_history_id=?", gameHistory.id) ?? [];
    res.status(200).json({ name: gameHistory.game, ...totals, date: gameHistory.date_of, players: gameHistoryPlayers });
}) 

export default handler;