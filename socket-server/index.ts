import { Server } from "socket.io";

import env from './env.json';

const io = new Server({
    cors: {
        origin: env.cors.origin
    }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected!`)
  io.emit('update', { info: "connection" })
});

io.listen(env.port);