import { PlayersList } from '@/components/games';
import { CrashCanvas } from '@/components/games/crash';
import { Game } from '@/lib/game';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const Crash = () => {

    // react hooks
    const betRef: any = useRef(0);
    const socket = useRef<Socket | null>(null);

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ joined, setJoined ] = useState<boolean>(false);
    const [ bet, setBet ] = useState<number>();
    const [ status, setStatus ] = useState<Game.Status>();
    const [ tick, setTick ] = useState<Game.Tick>();

    useEffect(() => {
      init();
      return () => deinit();
    }, [socket!]);

    const onSubmit = useCallback((e: any) => {
        e.preventDefault();
        socket.current?.emit("opt", joined ? 0 : betRef.current.value);
      },
      [joined, socket]
    );
  
    // socket management
    const init = async () => {
      setLoading(true);

      let res = await fetch('/api/user/auth');
      let { token }: any = await res.json();
      socket.current = io("10.22.17.247:3001", { 
        query: { game: "Test" }, 
        auth: { token }
      });
  
      socket.current.on("opt", data => {
        setBet(data.amount ?? 0);
        setJoined(data.confirmed);
      });

      socket.current.on("tick", data => setTick(data));
      socket.current.on("status", data => setStatus(data));
      socket.current.on("connect_error", (err) => toast.error(err.message ?? "Something went wrong."));

      setLoading(false);
    }

    const deinit = () => {
      socket.current?.disconnect();
    }
  
    return(
      <Container style={{ margin: "1rem"}}>
        <Row>
          <Col sm={4} style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
            <PlayersList tick={tick!} status={status!} />
          </Col>
          <Col sm={8}>
            <Card>
              <Card.Header>Rocket Ride</Card.Header>
              <Card.Body style={{ padding: "1rem" }}>
                WE&apos;RE GOING TO THE MOON!
                <CrashCanvas tick={tick} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={4} style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
            <Card style={{ width: '18rem' }}>
              <Card.Header>Bet</Card.Header>
              <Card.Body>
                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3" controlId="betAmount">
                    <Form.Control ref={betRef} disabled={joined} type="number" placeholder="Enter a bet to place" />
                    <Form.Text className="text-muted" >{joined ? `Your current bet is ${bet}.`: "Place a bet to enter the game."}</Form.Text>
                  </Form.Group>
                  <Button disabled={loading} variant={joined ? "danger" : "success"} type="submit" className="w-2">
                    {joined ? "Leave queue" : "Queue for game"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
    
  export default Crash;