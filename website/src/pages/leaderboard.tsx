import { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";

import { PageLoadingSpinner } from "@/components/loading";
import { Leader } from "@/lib/models";
import { fetcher } from "@/lib/fetcher";

import styles from "../styles/leaderboard.module.css";
import { InlineCoin } from "@/components/coin";

interface Leaderboard {

  player?: Leader;
  leaders: Leader[];

}

// The Leaderboard
const Leaderboards = () => {

  const [ loading, setLoading ] = useState<boolean>();
  const [ leaderboard, setLeaderboard ] = useState<Leaderboard>();

  useEffect(() => {

    const loadLeaderboard = async () => {
      const leaderboard = await fetcher('/api/transactions/leaderboard');
      setLeaderboard(leaderboard as Leaderboard);
      setLoading(false);
    }

    setLoading(true);
    loadLeaderboard();
  }, []);

  if (loading || !leaderboard) return <PageLoadingSpinner />

  return (
    <Container className={styles.container}>
      <Table className={`text-light bg-primary p-5 ${styles.table}`}>
        <thead className={styles.thead}>
          <tr>
            <th>POSITION</th>
            <th>USERNAME</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard ? leaderboard.leaders.map((leader, index) => <LeaderboardPosition key={index} player={leader} highlighted={leaderboard.player?.position == leader.position} />) : undefined}
          {leaderboard.player && leaderboard.player.position > 10 ? <LeaderboardPosition player={leaderboard.player} highlighted={true} /> : undefined}
        </tbody>
      </Table>
    </Container>
  )
}

const LeaderboardPosition = ({ player, highlighted } : { player: Leader, highlighted?: boolean }) => {
  return (
    <tr className={highlighted ? "bg-info" : ""}>
        <td>#{player.position}</td>
        <td>{player.username}</td>
        <td><InlineCoin amount={player.total} /></td>
    </tr>
  )
}

export default Leaderboards;