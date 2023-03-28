import passport from 'passport';
import * as bcrypt from 'bcrypt';

import { Strategy as LocalStrategy } from 'passport-local';
import { execute } from '../db';
import Account from '../models';

type User = {
  id?: number;
} 

passport.serializeUser<any>((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser<Account>(async (user, done) => {
  const [ account ]: Account[] = await execute<Account>("SELECT * FROM accounts WHERE id=?", user.id);
  done(null, account);
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const [ user ]: Account[] = await execute<Account>("SELECT * FROM accounts WHERE email=?", email);
      if (user && await bcrypt.compare(password, user.password_hash)) done(null, { ...user, password_hash: undefined });
      else done(null, false, { message: 'Email or password is incorrect' });
    }
  )
);

export default passport;