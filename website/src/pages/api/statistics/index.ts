
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

handler.get<any, NextApiResponse>(async (req, res) => {
    let user = req.user;
    if (!user) {
        res.status(401).end();
        return;
    }

    let { page } = req.query;
    if (!page) {
        res.status(301).json({ message: "No page specified." });
        return;
    }

    let pageIndex = (page - 1) * 20;
    let mostRecent: Transaction[] | undefined = await execute<Transaction>("SELECT * FROM user_transaction_recent WHERE account_id=?", user.id);
    let pageRows: Transaction[] | undefined = await execute<Transaction>("SELECT * FROM user_transaction WHERE account_id=? ORDER BY id DESC LIMIT ?, ?", user.id, pageIndex, (pageIndex + 19));
    res.status(200).json({
        recent: mostRecent ? mostRecent[0] : {},
        page: {
            index: page,
            pageRows: pageRows ?? []
        }
    });
}) 

export default handler;