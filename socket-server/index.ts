import { Server, Socket } from "socket.io";

import env from './env.json';
import { PlayerManager, GameManager } from "./lib/manager";
import { Game, Player } from "./lib/models";
import { Nullable } from "./utils";
import { Games } from "./lib/games";
import { execute } from "./lib/db";

const io = new Server({ cors: { origin: env.cors.origin } });
const playerManager: PlayerManager = new PlayerManager;
const gameManager: GameManager = new GameManager;

// middleware to authenticate the client
io.use(async (socket: Socket, next: Function) => {
  let data: Player | Error = await playerManager.authenticate(socket);
  if (data instanceof Error) {
    next(data as Error);
    return;
  }

  // store total locally
  let [ row ]: any = await execute("SELECT total FROM user_transaction_recent WHERE account_id=?", data.id);
  data.total = row.total;
  data.bet = 0;

  playerManager.register(socket, data as Player);
  next();
})

// connection setup
io.on("connection", (socket: Socket) => {
  socket.on("disconnect", () => playerManager.deregister(socket));

  let gameType: any = socket.handshake.query.game;
  let game: Nullable<Game> = gameManager.join(socket, gameType as Games);
  if (!game) socket.disconnect();
});

io.listen(env.port);
console.log(`Socket server started on ${env.port}.`);

export { io, gameManager, playerManager };