import { Server, Socket } from "socket.io";

import env from './env.json';

const io = new Server({
    cors: {
        origin: env.cors.origin
    }
});

io.listen(env.port);

io.listen(env.port);