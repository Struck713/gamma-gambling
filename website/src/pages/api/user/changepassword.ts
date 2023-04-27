import nc from 'next-connect';
import { NextApiResponse } from 'next';

import auths from '@/lib/auth'
import { ValidateProps, ncOpts } from '@/lib/constants';
import { execute } from '@/lib/db';
import { Account } from '@/lib/models';
import { compare, hash } from 'bcrypt';
import { validateBody } from '@/lib/user/ajv';

const handler = nc(ncOpts);
handler.use(...auths);

handler.put<any, NextApiResponse>(
    validateBody({
        type: 'object',
        properties: {
          password: ValidateProps.user.password,
          newPassword: ValidateProps.user.password,
          confirmNewPassword: ValidateProps.user.password,
        },
        required: ['password', 'newPassword', 'confirmNewPassword'],
        additionalProperties: false,
    }),
    async (req, res) => {
        let user = req.user;
        if (!user) {
            res.status(401).end();
            return;
        }

        let { id } = user;
        let { password, newPassword, confirmNewPassword } = req.body;

        let [ account ] = await execute<Account>("SELECT * FROM account WHERE id=?", id) ?? [];
        if (!account || !await compare(password, account.password_hash!)) {
            res.status(400).json({ error: { message: "Invalid password." }});
            return;
        }

        if (newPassword !== confirmNewPassword) {
            res.status(301).json({ error: { message: "New password and confirm new password do not match." }});
            return;
        }

        let newPasswordHash = await hash(newPassword, 12);
        await execute("UPDATE account SET password_hash=? WHERE id=?", newPasswordHash, id)
        res.status(200).json({ message: "Password successfully updated." })
        return;
    }
);

export default handler;