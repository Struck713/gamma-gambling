import React, { ComponentProps, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import p5Types from "p5";
import { Card, Col, Container, Row } from "react-bootstrap";
import { GameStatus, PlayersList } from "@/components/games";
import { Socket, io } from "socket.io-client";
import { toast } from "react-hot-toast";

const maxMult = 8; //The maximum multiplier for the game
const paddingtop = 30;
const paddingright = 50;
let distancex = 0;
let heightz = 0;
let curviness = 0;
let multiplier = 0;

const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.frameRate(25);
    p5.createCanvas(600, 600).parent(canvasParentRef);
    p5.background(0,0,0,0);
    heightz = p5.height-100;
    distancex = p5.width / 2;

};

const draw = (p5: p5Types) => {
  p5.clear(); // you need to clear at the draw of each frame since the background is transparent, otherwise traces appear
  drawCurve(p5, curviness, distancex, heightz);
  if (curviness < 1500) curviness += 50; //Set max curviness during growth
  if (distancex < p5.width - paddingright) distancex += 0.55;
  if (heightz > paddingtop) heightz--;
};

const drawCurve = (p5: p5Types, curviness: any, distance:any, ht:any) => {
  p5.noFill();
  p5.stroke(255, 0, 0);
  p5.bezier(-curviness, p5.height, 0, p5.height, distance, ht, distance, ht);
  p5.textSize(32);
  p5.text("🚀", distance, ht);
  p5.textSize(20);
  p5.stroke(0);
  multiplier = (maxMult * (1 - (heightz-paddingtop)/(p5.height-100)));
  p5.fill(0);
  p5.text(`Multiplier = ${multiplier.toFixed(2)}x`, 20, 20);
}

const Crash = () => {

  const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
  });

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
    socket.on("connect_error", (err) => {
      console.log(err);
      toast.error(err.message);
    });

  }

  return(
    <Container style={{ margin: "1rem"}}>
      <Row>
        <Col style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
          <PlayersList players={status?.players} max={status?.max} />
        </Col>
        <Col>
          <Card>
            <Card.Header>Crash</Card.Header>
            <Card.Body style={{ padding: "1rem" }}>
                <Sketch setup={setup} draw={draw} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
  
export default Crash;