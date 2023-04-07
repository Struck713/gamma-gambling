import React, { ComponentProps, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import p5Types from "p5";
import Container from 'react-bootstrap/Container';
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

const Slots = () => {

  const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
  });

  return(
    <Container id="container">
      <Row>
        <Col xl id="textHere"><div id="ref"></div></Col>
        <Col xl id="gameHere">
          <div style={{ //center items
            paddingTop: 20, //adjust distance from bottom of navbar
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Sketch setup={setup} draw={draw} />
        </div>
      </Col>
    </Row>
  </Container>
  )
}

const maxMult = 8; //The maximum multiplier for the game
const paddingtop = 30;
const paddingright = 50;
let distancex = 0;
let heightz = 0;
let curviness = 0;
let multiplier = 0;
let inputAmount, inputMultiplier, buttonBet, textAm, textIM;
let doc: any;
const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.frameRate(25);
    p5.createCanvas(600, 600).parent(canvasParentRef);
    p5.background(0,0,0,0);
    heightz = p5.height-100;
    distancex = p5.width/2;
    
    //inputs
    inputAmount = p5.createInput().parent("textHere");
    inputAmount.attribute("id", "inputAmount")
    //inputAmount.position(300, 300);
    inputMultiplier = p5.createInput().parent("textHere");
    //inputMultiplier.position(300, 240);
    inputMultiplier.attribute("id", "inputMultiplier");
    buttonBet = p5.createButton("Bet!").parent("textHere");
    //buttonBet.position(inputAmount.x + inputAmount.width, 300);
    buttonBet.attribute("id", "buttonBet");
    textAm = p5.createElement('p', "Enter the amount you want to bet:").parent("textHere");
    //textAm.position(300, 270);
    textAm.attribute("id", "textAm");
    textIM = p5.createElement('p', "Enter the multiplier you'd like to stop at:").parent("textHere");
    //textIM.position(300, 210);
    textIM.attribute("id", "textIM");
    let IAM = document.querySelector("#inputAmount");
    let IM = document.querySelector("#inputMultiplier")
    let BB = document.querySelector("#buttonBet")
    let TAM = document.querySelector("#textAm");
    let TIM = document.querySelector("#textIM");
    TAM?.parentNode?.insertBefore(TAM, document.getElementById("ref").nextSibling);
    IM?.parentNode?.insertBefore(IM, TAM.nextSibling);
    BB?.parentNode?.insertBefore(BB, IM.nextSibling);
    TIM?.parentNode?.insertBefore(TIM, BB.nextSibling);
    IAM?.parentNode?.insertBefore(IAM, TIM.nextSibling);
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