import auths from '@/lib/auth';
import { ValidateProps, ncOpts } from '@/lib/constants';
import { execute } from '@/lib/db';
import { Account } from '@/lib/models';
import { validateBody } from '@/lib/user/ajv';

import nc from 'next-connect';
import * as bcrypt from 'bcrypt';

import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

const handler = nc(ncOpts);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      password: ValidateProps.user.password,
      confirmPassword: ValidateProps.user.password,
      email: ValidateProps.user.email,
    },
    required: ['username', 'password', 'email', 'confirmPassword'],
    additionalProperties: false,
  }),
  ...auths,
  async (req: any, res: any, next: any) => {

    let { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res
        .status(403)
        .json({ error: { message: 'Password and confirm password do not match.'}})
      return;
    }

    //username = slugUsername(req.body.username);
    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    
    if (await execute("SELECT * FROM account WHERE email=?", email)) {
      res
        .status(403)
        .json({ error: { message: `The email has already been used.` } });
      return;
    }

    if (await execute("SELECT * FROM account WHERE username=?", username)) {
      res
        .status(403)
        .json({ error: { message: 'The username has already been used.' } });
      return;
    }

    password = await bcrypt.hash(password, 10);
    const queryResponse: any = await execute("INSERT INTO account (username, email, password_hash) VALUES (?, ?, ?)", username, email, password);
    if (!queryResponse.insertId) {
      res
        .status(403)
        .json({ error: { message: 'Something went wrong when creating your account.' } });
      return;
    }
    
    const user: Account = {
      id: queryResponse.insertId, 
      email: email, 
      username: username,
      password_hash: undefined
    };

    res.status(201).json({ user });
    req.login(user, (err: any) => {
      if (err) next(err);
      res.status(201).json({ user });
    });
  }
);

export default handler;