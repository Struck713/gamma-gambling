import { DynamicSketch, PlayersList } from '@/components/games';
import { PageLoadingSpinner } from '@/components/loading';
import { Game } from '@/lib/game';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

import p5 from "p5";
import { Nullable, Undefineable } from "@/lib/utils";

const Crash = () => {

    const socket = useRef<Socket | null>(null);

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ status, setStatus ] = useState<Game.Status>();
    const [ tick, setTick ] = useState<Game.Tick>();

    useEffect(() => {
    
      const loadSocket = async () => {
        let res = await fetch('/api/user/auth');
        let { token }: any = await res.json();
        socket.current = io(Game.SERVER_URL, { 
          query: { game: "Crash" }, 
          auth: { token },
          transports: [ "websocket" ],
          rejectUnauthorized: false
        });
  
        socket.current.on("tick", data => setTick(data));
        socket.current.on("status", data => setStatus(data));
        socket.current.on("game_error", (message) => toast.error(message ?? "Something went wrong."));
        socket.current.on("connect_error", (err) => toast.error(err.message ?? "Something went wrong."));
  
        setLoading(false);
      }

      const unloadSocket = () => {
        socket.current?.disconnect();
      }

      setLoading(true);
      loadSocket();
      return () => unloadSocket();
    }, []);

    if (loading) return <PageLoadingSpinner />
  
    return(
      <Container className="p-2">
        <Row>
          <Col style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
            <PlayersList tick={tick!} status={status!} />
          </Col>
          <Col>
            <Card>
              <Card.Header>Rocket Ride</Card.Header>
              <Card.Body style={{ padding: "1rem" }}>
                WE&apos;RE GOING TO THE MOON!
                <CrashCanvas tick={tick} />
              </Card.Body>
            </Card>
          </Col>
          <Col style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
            <CrashBetBox socket={socket.current} tick={tick} />
          </Col>
        </Row>
      </Container>
    )
}

const setup = (p5: p5, canvasParentRef: Element) => {
    p5.frameRate(25);
    p5.createCanvas(600, 600).parent(canvasParentRef);
    p5.background(0,0,0,0);
    p5.textAlign(p5.CENTER, p5.CENTER);
}

// let x = 0;
// let y = 0;
// let yValues: any = [];

const draw = (p5: p5, tick: Game.Tick) => {
    if (!tick || tick.state != Game.State.Started) return;
    p5.clear();
 
    p5.text(tick.data.multiplier, p5.width / 2, p5.height / 2)

    // let yValue = 100 * p5.log(x / 2) / p5.log(5);
    // yValues.push(tick.data.multiplier);

    // p5.noStroke();
    // p5.fill(200);
    // p5.beginShape();
    // p5.vertex(0, p5.height);
    // for (let i = 0; i < yValues.length; i++) p5.vertex(i, p5.height - yValues[i]);
    // p5.vertex((yValues.length - 1), p5.height);
    // p5.endShape(p5.CLOSE);

    // x = p5.constrain(x, 0, p5.width);
    // y = p5.constrain(p5.height - yValue, 0, p5.height - 48);

    // p5.text(":rocket:", x, y);

    // x += 1;
}

const CrashCanvas = ({ tick } : { tick?: Game.Tick }) => {
    if (!tick) return <></>;
    return <DynamicSketch setup={setup} draw={(p5: p5) => draw(p5, tick)} />
}

const CrashBetBox = ({ socket, tick } : { socket: Nullable<Socket>, tick: Undefineable<Game.Tick>}) => {

    const betRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const [ bet, setBet ] = useState<number>(0);
    const [ pull, setPull ] = useState<number>(0);
    const [ joined, setJoined ] = useState<boolean>(false);

    const handleButton = () => {
        if (tick?.state == Game.State.Lobby) socket?.emit("opt", joined ? 0 : betRef.current?.value);
        if (tick?.state == Game.State.Started) socket?.emit("pull");
    }

    const displayButton = () => {
        if (tick?.state == Game.State.Lobby) return joined ? "Leave queue" : "Queue for game";
        if (joined) return !pull ? "Pull out" : `Pulled out at ${pull}x`; 
        return "Waiting for next round..";
    }

    const displayVariant = () => {
        if (tick?.state == Game.State.Lobby) return joined ? "danger" : "success";
        return joined ? "success" : "muted";
    }

    const toggleButton = () => {
        if (tick?.state == Game.State.Lobby) return false;
        if (tick?.state == Game.State.Ended) return true;
        return !joined;
    }

    socket?.on("reset", () => { setPull(0); setBet(0); setJoined(false); });
    socket?.on("pull", data => setPull(data));
    socket?.on("opt", data => { setBet(data.amount ?? 0); setJoined(data.confirmed); });

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Header>Bet</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="betAmount">
                        <Form.Control ref={betRef} type="number" placeholder="Enter a bet to place" />
                        <Form.Text className="text-muted" >{joined ? `Your current bet is ${bet}.`: "Place a bet to enter the game."}</Form.Text>
                    </Form.Group>
                    <Button onClick={handleButton} disabled={toggleButton()} variant={displayVariant()} className="w-2">{displayButton()}</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default Crash;