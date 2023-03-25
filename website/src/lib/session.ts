import { Server } from "http";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";

import { ServerlessSQLStore } from "./store";

const connectStore = new ServerlessSQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
});

const getSession = nextSession({
  store: connectStore,
});