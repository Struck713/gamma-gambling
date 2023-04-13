import passport from '@/lib/auth/passport';
import auths from '@/lib/auth';

import jwt from "jsonwebtoken";

import { NextApiResponse } from 'next';

import nc from 'next-connect';
import { ncOpts } from '@/lib/constants';

const handler = nc(ncOpts);
handler.use(...auths);

handler.post<any, NextApiResponse>(passport.authenticate('local'), (req, res) => {
    res.json({ user: req.user });
});

handler.get<any, NextApiResponse>(async (req, res) => {
    let user = req.user;
    if (!user) res.json(401).end();

    let token = await jwt.sign({ id: user.id, username: user.username }, process.env.TOKEN!, { expiresIn: 900 });
    res.json({ token });
}) 

handler.delete<any, NextApiResponse>(async (req, res) => {
    await req.session.destroy();
    res.status(204).end();
})

export default handler;