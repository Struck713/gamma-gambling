import auths from '@/lib/auth';
import { execute } from '@/lib/db';
import nc from 'next-connect';

const handler = nc();

handler.post(
//   validateBody({
//     type: 'object',
//     properties: {
//       username: ValidateProps.user.username,
//       name: ValidateProps.user.name,
//       password: ValidateProps.user.password,
//       email: ValidateProps.user.email,
//     },
//     required: ['username', 'name', 'password', 'email'],
//     additionalProperties: false,
//   }),
  ...auths,
  async (req: any, res: ) => {

    let { username, name, email, password } = req.body;
    //username = slugUsername(req.body.username);
    //email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }
    if (await findUserByEmail(db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }
    if (await findUserByUsername(db, username)) {
      res
        .status(403)
        .json({ error: { message: 'The username has already been taken.' } });
      return;
    }
    const user = await insertUser(db, {
      email,
      originalPassword: password,
      bio: '',
      name,
      username,
    });
    req.logIn(user, (err) => {
      if (err) throw err;
      res.status(201).json({
        user,
      });
    });
  }
);

export default handler;