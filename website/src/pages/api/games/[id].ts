import auths from "@/lib/auth";
import { ncOpts } from "@/lib/constants";
import { execute } from "@/lib/db";
import { GameHistory } from "@/lib/models";
import { NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc(ncOpts);
handler.use(...auths);

handler.get<any, NextApiResponse>(async (req, res) => {
    const { id } = req.query;
    const [ gameHistory ] = await execute<GameHistory>("SELECT * FROM game_history WHERE id=?", id) ?? [];
    if (!gameHistory) {
        res.status(200).json({ message: "Invalid request." });
        return;
    }

    const gameHistoryPlayers = await execute("SELECT account.username, ut.bet_amt, ut.return_amt FROM game_history_players AS ghp WHERE game_history_id=? JOIN user_transaction AS ut ON ut.id=ghp.user_transaction_id JOIN account ON ghp.account_id=account.id", gameHistory.id);
    res.status(200).json({ name: gameHistory.game, players: gameHistoryPlayers });
}) 

export default handler;