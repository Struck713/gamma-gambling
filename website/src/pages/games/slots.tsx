import React, { ComponentProps, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import p5Types from "p5";
import io, { Socket } from "socket.io-client";
import { toast } from "react-hot-toast";
import { GameStatus, PlayersList } from "@/components/games";

// The slots game
// See annotations in JS for more information
const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(600, 700).parent(canvasParentRef);
    p5.background(0,0,0,0);
};

let x = 50;
const y = 50;
const draw = (p5: p5Types) => {
  p5.clear(); // you need to clear at the draw of each frame since the background is transparent, otherwise traces appear
  p5.ellipse(x, y, 70, 70);
  x++;
};

const Sketch = dynamic(import('react-p5'), { ssr: false });

const Slots = () => {

  const [ status, setStatus ] = useState<GameStatus>();

  useEffect(() => {
    socketInitializer()
  }, []);

  let socket: Socket;
  const socketInitializer = async () => {
    let res = await fetch('/api/user/auth');
    let { token }: any = await res.json();
    socket = io("localhost:3030", { 
      query: { game: "Slots" }, 
      auth: { token }
    });

    // request the game status
    socket.emit("status");

    socket.on("status", data => setStatus(data));
    socket.on("connect_error", (err) => toast.error(err.message));

  }

  return(
    <div style={{ //center items
      paddingTop: 20, //adjust distance from bottom of navbar
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  }}>
      <Sketch setup={setup} draw={draw} />
      <PlayersList players={status?.players} max={status?.max}  />
  </div>
  )
}
  
export default Slots;