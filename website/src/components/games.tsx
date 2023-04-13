import { Card, ListGroup, Badge } from "react-bootstrap";

const PlayerListItem: React.FC<{username: string, bet: number}> = ({ username, bet }) => <ListGroup.Item>{username} <BetBadge bet={bet}/></ListGroup.Item>;
const BetBadge: React.FC<{bet: number}> = ({ bet }) => <Badge className="float-end" bg={bet ? "secondary" : "danger"}>{bet ? bet : "No bet"}</Badge>;

const PlayersList: React.FC<{tick: GameTick, status: GameStatus}> = ({ tick, status }) => {
    if (!status) return <DefaultCard title="Waiting for players..." subtitle="Loading players list.." />;
    
    let { players, max } = status;

    return (
        <Card>
            <Card.Header>{tick ? `${tick.state} - ${JSON.stringify(tick.data)}` : "Error"}</Card.Header>
            <Card.Body  style={{ width: '18rem' }}>
                <Card.Subtitle className="mb-2 text-muted">{players?.length} out of {max}</Card.Subtitle>
                <ListGroup variant="list-group-flush">{players?.map((player: PlayerStatus) => <PlayerListItem key={player.username} username={player.username} bet={player.bet} />)}</ListGroup>
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

    players?: PlayerStatus[];
    max?: number;

}

interface GameTick {

    data?: any;
    state?: GameState;

}

enum GameState {

    Waiting = "Waiting",
    Started = "Started",
    Lobby = "Lobby",
    Ended = "Ended",
    Post = "Post"

}

interface PlayerStatus {

    id: number;
    username: string;
    bet: number;

}

export type { GameStatus, GameTick, PlayerStatus };
export { PlayersList };