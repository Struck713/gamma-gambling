import nc from 'next-connect';
import { NextApiResponse } from 'next';

import auths from '@/lib/auth'
import { ncOpts } from '@/lib/constants';

const handler = nc(ncOpts);
handler.use(...auths);
handler.get<any, NextApiResponse>(async (req, res) => res.json({ user: req.user }));

export default handler;