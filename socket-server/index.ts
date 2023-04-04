import { Server, Socket } from "socket.io";

import env from './env.json';

const io = new Server({
    cors: {
        origin: env.cors.origin
    }
});

io.on("connection", (socket: Socket) => {
  socket.emit("requestdata", {});
  socket.on("userdata", data => {
    console.log(data.name);
  })
});

io.listen(env.port);