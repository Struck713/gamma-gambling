import { Server, Socket } from "socket.io";

import env from './env.json';
import { Game, Player } from "./lib/models";
import { Games } from "./lib/games";
import { Nullable } from "./utils";
import { PlayerManager, GameManager } from "./lib/manager";

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