import { GameStatus, PlayersList } from '@/components/games';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const Crash = () => {
  
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
    
  export default Crash;