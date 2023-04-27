import { DynamicSketch, PlayersList } from '@/components/games';
import { PageLoadingSpinner } from '@/components/loading';
import { Game } from '@/lib/game';
import { MutableRefObject, createRef, useEffect, useMemo, useRef, useState } from 'react';
import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import Image from 'next/image';

import p5 from "p5";
import { Nullable, Undefineable } from "@/lib/utils";

import styles from "../../styles/rocketride.module.css"
import { Images } from "@/components/images"

const RocketRide = () => {

  const socket = useRef<Socket | null>(null);

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ status, setStatus ] = useState<Game.Status>();
  const [ tick, setTick ] = useState<Game.Tick>();

  useEffect(() => {

    const loadSocket = async () => {
      let res = await fetch('/api/user/auth');
      let { token }: any = await res.json();
      socket.current = io(Game.SERVER_URL, {
        query: { game: "Rocket Ride" },
        auth: { token },
        rejectUnauthorized: false
      });

      socket.current.on("tick", data => setTick(data));
      socket.current.on("status", data => setStatus(data));
      socket.current.on("game_error", (message) => toast.error(message ?? "Something went wrong."));
      socket.current.on("connect_error", (err) => toast.error("Could not connect to game servers. Are they down?"));

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

  return (
    <>
      <Container className={`p-2 ${styles.container}`}>
        <Row>
          <Col lg={4} className={styles.col}>
            <span className={styles.names}><PlayersList tick={tick!} status={status!} /></span>
          </Col>
          <Col lg={8}>
            <Card>
              <Card.Header>Rocket Ride</Card.Header>
              <Card.Body className={styles.cardBody}>
                WE&apos;RE GOING TO THE MOON!
                <RocketRideCanvas socket={socket.current} tick={tick} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const RocketRideCanvas = ({ socket, tick }: { socket: Nullable<Socket>, tick: Undefineable<Game.Tick> }) => {

  const betRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  const [bet, setBet] = useState<number>(0);
  const [pull, setPull] = useState<number>(0);
  const [joined, setJoined] = useState<boolean>(false);

  useEffect(() => {
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.keyCode == 32) handleButton();
    }
  }, [ tick ])
  
  const handleButton = () => {
    if (tick?.state == Game.State.Lobby) socket?.emit("opt", joined ? 0 : betRef.current?.value);
    if (tick?.state == Game.State.Started) socket?.emit("pull");
  }

  const displayButton = () => {
    if (tick?.state == Game.State.Lobby) return joined ? "Leave queue" : "Queue for game";
    if (joined) return !pull ? "Eject (hit space)" : `Ejected at ${pull}x`;
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

  const setup = (p5: p5, canvasParentRef: Element) => {
    let dimension = canvasParentRef.getBoundingClientRect();
    p5.createCanvas(dimension.width, dimension.width - (dimension.width / 3)).parent(canvasParentRef);
    p5.background(0, 0, 0, 0);
    p5.textAlign(p5.CENTER, p5.CENTER);
  }
  
  const draw = (p5: p5, tick: Undefineable<Game.Tick>) => {
    if (tick) {
      if (tick.state == Game.State.Ended) {
        p5.textSize(65);
        p5.fill(255,54,60);
        p5.text("CRASHED.", p5.width / 2, p5.height / 2);
        return;
      }
      
      if (tick.state == Game.State.Started) {
        p5.clear();
    
        let multiplier = tick.data.multiplier;
        let mappedMultiplier = p5.map(multiplier, 0, multiplier + (p5.height / 2), p5.height, 0);
      
        p5.stroke(0);
        p5.strokeWeight(3);
        p5.line(0, p5.height, multiplier, mappedMultiplier);
        
        p5.noStroke();
        p5.textSize(20);
        p5.text(`${(multiplier / 10)}x`, (multiplier + 10), (mappedMultiplier - 10));
        return;
      }
    }
  
    p5.clear();
    p5.textSize(25);
    p5.fill(0);
    p5.text(`Getting ready for takeoff..`, 150, p5.height - 20);
  }

  socket?.on("reset", () => { setPull(0); setBet(0); setJoined(false); });
  socket?.on("pull", data => setPull(data));
  socket?.on("opt", data => { setBet(data.amount ?? 0); setJoined(data.confirmed); });

  if (!tick) return <></>;
  return (
    <>
      <DynamicSketch setup={setup} draw={(p5) => draw(p5, tick)}/>
      <Form onSubmit={(e) => { e.preventDefault(); handleButton() }}>
        <Form.Group className="mb-3" controlId="betAmount">
          <div className="d-flex align-items-center">
            <Image className={styles.coin} src={Images.GammaCoin} alt="GAMMA COIN" />
            <Form.Control ref={betRef} type="number" placeholder="Enter a bet to place" />
          </div>
          <Form.Text className="text-muted" >{joined ? `Your current bet is ${bet}.` : "Place a bet to enter the game."}</Form.Text>
        </Form.Group>
        <Button onClick={handleButton} disabled={toggleButton()} variant={displayVariant()} className={`w-2 ${styles.button}`}>{displayButton()}</Button>
      </Form>
    </>
  )
}

export default RocketRide;