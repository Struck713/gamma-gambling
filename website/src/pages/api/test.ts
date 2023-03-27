import { execute } from '@/lib/db';
import Account from '@/lib/models';
import { NextApiResponse, NextApiRequest } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const [ account ]: Account[] = await execute<Account>("SELECT * FROM account WHERE id=?", 2);
    res.status(200).json(account);
}

export default handler;