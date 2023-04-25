
import auths from "@/lib/auth";
import { ncOpts } from "@/lib/constants";
import { execute } from "@/lib/db";
import { Leader } from "@/lib/models";
import { NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc(ncOpts);
handler.use(...auths);

handler.get<any, NextApiResponse>(async (req, res) => {
    let all: Leader[] | undefined = await execute<Leader>("SELECT * FROM leaderboard");
    res.status(200).json(all);
}) 

export default handler;