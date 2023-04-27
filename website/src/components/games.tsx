import dynamic from "next/dynamic";
import { PlayerStatus, Game } from "@/lib/game";
import { Card, ListGroup, Badge } from "react-bootstrap";

const PlayerListItem: React.FC<{ username: string, data: any }> = ({ username, data }) => <ListGroup.Item>{username} <PlayerListItemBadge data={data}/></ListGroup.Item>;
const PlayerListItemBadge: React.FC<{ data: any }> = ({ data }) => <Badge className="float-end" bg={data ? "secondary" : "danger"}>{data ? data : "None"}</Badge>;

const decodeTick = (tick: Game.Tick) => {
    if (!tick) return "Loading...";
    switch (tick?.state) {
        case Game.State.Lobby: return `Game will start in ${tick.data.time}s.`;
        case Game.State.Waiting: return "Waiting for players...";
        case Game.State.Started: return "Game started."
        case Game.State.Ended: return "Game ended.";
    }
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

export const DynamicSketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false });
export const PlayersList: React.FC<{ tick: Game.Tick, status: Game.Status }> = ({ tick, status }) => {
    if (!status) return <DefaultCard title="Waiting for players..." subtitle="Loading players list.." />;
    let { players, max } = status;
    return (
        <Card>
            <Card.Header>{decodeTick(tick)}</Card.Header>
            <Card.Body  style={{ width: '18rem' }}>
                <Card.Subtitle className="mb-2 text-muted">{players.length} out of {max}</Card.Subtitle>
                <ListGroup variant="list-group-flush">{players.map((player: PlayerStatus) => <PlayerListItem key={player.username} username={player.username} data={player.data} />)}</ListGroup>
            </Card.Body>
        </Card>
    )
}