import { LoadingSpinner } from "@/components/loading";
import { Leader } from "@/lib/models";
import { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import styles from "../styles/leaderboard.module.css";
import { Images } from "@/components/images";
import Image from "next/image";
import { Utils } from "@/lib/utils";

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
      const res = await fetch('/api/transactions/leaderboard');
      const json = await res.json();
      setLeaderboard(json);
    }

    setLoading(true);
    loadLeaderboard();
    setLoading(false);

  }, []);

  if (loading || !leaderboard) return <LoadingSpinner />

  return (
    <Container className={styles.container}>
      <Table className={`text-light bg-primary border-primary p-5 ${styles.table}`}>
        <thead className={styles.thead}>
          <tr>
            <th>POSITION</th>
            <th>USERNAME</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.player ? <LeaderboardPosition player={leaderboard.player} highlighted={true} /> : undefined}
          {leaderboard?.leaders.map((leader, index) => <LeaderboardPosition key={index} player={leader}/>)}
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
        <td><span className="d-flex align-items-center"><Image className={styles.coin} src={Images.GammaCoin} alt="GAMMA COIN" />{Utils.format(player.total)}</span></td>
    </tr>
  )
}

export default Leaderboards;