import { Card, ListGroup } from "react-bootstrap"

const PlayersList = (status: GameStatus) => {
    let { players, max } = status;
    if (!(players && max)) return <DefaultCard title="Waiting for players..." subtitle="Loading players list.." />;
    return (
        <Card>
            <Card.Header>Waiting for players...</Card.Header>
            <Card.Body  style={{ width: '18rem' }}>
                <Card.Subtitle className="mb-2 text-muted">{players.length} out of {max}</Card.Subtitle>
                <ListGroup variant="list-group-flush">
                    {players.map((player: string) => <ListGroup.Item key={player}>{player}</ListGroup.Item>)}
                </ListGroup>
            </Card.Body>
        </Card>
    )
}

// easy creation of a functional component
const DefaultCard: React.FC<{title: string, subtitle: string}> = ({ title, subtitle }) => {
    return (
        <Card>
            <Card.Body style={{ width: '18rem' }}>
                <Card.Header>{title}</Card.Header>
                <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

interface GameStatus {

    players?: string[];
    max?: number;

}

export type { GameStatus };
export { PlayersList };