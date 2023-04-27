
import auths from "@/lib/auth";
import { ncOpts } from "@/lib/constants";
import { execute } from "@/lib/db";
import { Leader } from "@/lib/models";
import { NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc(ncOpts);
handler.use(...auths);

handler.get<any, NextApiResponse>(async (req, res) => {
    let leaders = await execute<Leader>("SELECT * FROM leaderboard LIMIT 10");
    if (!req.user) {
        res.status(200).json({ leaders });
        return;
    }

    let [ player ] = await execute<Leader>("SELECT * FROM leaderboard WHERE id=?", req.user.id) ?? [];
    res.status(200).json({ player, leaders });
}) 

export default handler;