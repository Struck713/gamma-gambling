import nextSession from "next-session";
import { ServerlessSQLStore } from "./store";
import { IncomingMessage, ServerResponse } from "http";
import { promisifyStore } from 'next-session/lib/compat'

const connectStore = new ServerlessSQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 2 * 7 * 24 * 60 * 60
});

const getSession = nextSession({
  store: connectStore,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 7 * 24 * 60 * 60,
    path: '/',
    sameSite: 'strict'
  },
  touchAfter: 1 * 7 * 24 * 60 * 60
});

const session = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>, next: () => {}) => {
  await getSession(req, res);
  next();
}

export default session;