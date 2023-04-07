import { Server, Socket } from "socket.io";

import env from './env.json';
import { Game, Player } from "./lib/models";
import { Games } from "./lib/games";
import { Nullable } from "./utils";
import { PlayerManager, GameManager } from "./lib/manager";

const io = new Server({ cors: { origin: env.cors.origin } });
const playerManager: PlayerManager = new PlayerManager;
const gameManager: GameManager = new GameManager;

io.listen(env.port);

io.listen(env.port);
console.log(`Socket server started on ${env.port}.`);

export { io, gameManager, playerManager };