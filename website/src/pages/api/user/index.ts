import nc from 'next-connect';
import auths from '@/lib/auth'
import { NextApiResponse } from 'next';

const handler = nc();
handler.use(...auths);
handler.get<any, NextApiResponse>(async (req, res) => res.json({ user: req.user }));

export default handler;