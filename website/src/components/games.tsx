import { Card, ListGroup } from "react-bootstrap"

const PlayersList = ({ players, max }: GameStatus) => {
    if (!players || !max) return <></>;
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
            <Card.Title>Waiting for players...</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{players.length} out of {max}</Card.Subtitle>
            <ListGroup variant="list-group-flush">
                {players.map((player: string) => <ListGroup.Item key={player}>{player}</ListGroup.Item>)}
            </ListGroup>
            </Card.Body>
        </Card>
    )
}

interface GameStatus {

    players?: string[];
    max?: number;

}

export type { GameStatus };
export { PlayersList };