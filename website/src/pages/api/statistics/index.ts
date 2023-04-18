
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

    let all: Transaction[] | undefined = await execute<Transaction>("SELECT * FROM transaction WHERE account_id=? ORDER BY id DESC", [ user.id ]);
    res.status(200).json({
        recent: all ? all[0] : {},
        all: all ?? []
    });
}) 

export default handler;