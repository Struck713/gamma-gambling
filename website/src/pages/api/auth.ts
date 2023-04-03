import passport from '@/lib/auth/passport';
import auths from '@/lib/auth';

import { NextApiResponse } from 'next';
import nc from 'next-connect';

const handler = nc();
handler.use(...auths);

handler.post(passport.authenticate('local'), (req: any, res: NextApiResponse) => {
    res.json({ user: req.user });
});

handler.delete(async (req: any, res: NextApiResponse) => {
    await req.session.destroy();
    res.status(204).end();
})

export default handler;