
/*
let user = req.user;
    if (!user) res.json(401).end();
    */

import auths from "@/lib/auth";
import { ncOpts } from "@/lib/constants";
import { execute } from "@/lib/db";
import { Transaction } from "@/lib/models";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc(ncOpts);
handler.use(...auths);

handler.get<NextApiRequest, NextApiResponse>(async (req, res) => {
    let user = req.user;
    if (!user) {
        res.status(401).end();
        return;
    }

    let recent: Transaction[] | undefined = await execute<Transaction>("SELECT * FROM user_transaction_recent WHERE account_id=?", user.id);
    if (!recent) res.status(301).end();
    else res.status(200).json(recent[0]);
}) 

export default handler;