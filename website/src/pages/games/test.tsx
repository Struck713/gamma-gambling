import { GameStatus, PlayersList } from '@/components/games';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Card, Col, Row, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const Crash = () => {

    const betRef: any = useRef(0);

    const [ loading, setLoading ] = useState<boolean>();
    const [ bet, setBet ] = useState<number>();
    const [ status, setStatus ] = useState<GameStatus>();
  
    let socket: Socket;
    const init = async () => {
      setLoading(true);

      let res = await fetch('/api/user/auth');
      let { token }: any = await res.json();
      socket = io("localhost:3001", { 
        query: { game: "Test" }, 
        auth: { token }
      });
  
      socket.on("bet", data => {
        if (data.confirmed) setBet(data.amount);
        else setBet(0);
      });

      socket.on("debug", data => console.log(data));
      socket.on("status", data => setStatus(data));
      socket.on("connect_error", (err) => toast.error(err.message));

      setLoading(false);
    }

    const deinit = () => {
      socket.disconnect();
    }

    useEffect(() => {
      init();
      return () => deinit();
    }, [socket!]);

    const onSubmit = useCallback((e: any) => {
        e.preventDefault();
        socket.emit("bet", betRef.current.value);
      },
      [socket!]
    );
  
    return(
      <Container style={{ margin: "1rem"}}>
        <Row>
          <Col sm={4} style={{ display: "flex", justifyContent: "center", flexDirection: "row" }}>
            <PlayersList players={status?.players} max={status?.max} />
          </Col>
          <Col sm={8}>
            <Card>
              <Card.Header>Coin Flip</Card.Header>
              <Card.Body style={{ padding: "1rem" }}>
                Flip a coin, heads or tails my friend.
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
                    <Form.Control ref={betRef} type="number" placeholder="Enter a bet to place" />
                    <Form.Text className="text-muted">{bet ? `Your current bet is ${bet}.`: "You have not placed a bet."}</Form.Text>
                  </Form.Group>
                  <Button disabled={loading} variant="primary" type="submit" className="w-2">
                    Place bet
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