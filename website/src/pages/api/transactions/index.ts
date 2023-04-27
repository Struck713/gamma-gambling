import auths from "@/lib/auth";
import { ncOpts } from "@/lib/constants";
import { execute } from "@/lib/db";
import { Transaction } from "@/lib/models";
import { NextApiResponse } from "next";
import nc from "next-connect";

const handler = nc(ncOpts);
handler.use(...auths);

const AMOUNT_PER_PAGE = 10;

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

    let pageIndex = page * AMOUNT_PER_PAGE;
    let totalCount: { total: number }[] | undefined = await execute<any>("SELECT COUNT(*) as total FROM user_transaction WHERE account_id=?", user.id);
    let totalPages = totalCount ? Math.ceil(totalCount[0].total / AMOUNT_PER_PAGE) : 1;
    let pageRows: Transaction[] | undefined = await execute<Transaction>("SELECT * FROM user_transaction WHERE account_id=? ORDER BY id DESC LIMIT ?, ?", user.id, pageIndex, AMOUNT_PER_PAGE);
    res.status(200).json({
        totalPages,
        page: {
            index: page,
            rows: pageRows ?? []
        }
    });
}) 

export default handler;