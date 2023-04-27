import { LoadingSpinner } from "@/components/loading";
import { Leader } from "@/lib/models";
import { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import styles from "../styles/leaderboard.module.css"

// The Leaderboard
const Leaderboards = () => {

  const [ loading, setLoading ] = useState<boolean>();
  const [ leaderboard, setLeaderboard ] = useState<Leader[]>([]);

  useEffect(() => {

    const loadLeaderboard = async () => {
      const res = await fetch('/api/account/leaderboard');
      const json = await res.json();
      setLeaderboard(json);
    }

    setLoading(true);
    loadLeaderboard();
    setLoading(false);

  }, []);

  if (loading) return <LoadingSpinner />

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
          {leaderboard.map((leader, index) => 
            <tr key={index}>
              <td className={textColor(index)}>#{index + 1}</td>
              <td>{leader.username}</td>
              <td>{leader.total}</td>
            </tr>
          )}
          <tr className="bg-info">
              <td>#user_id</td>
              <td>username</td>
              <td>total</td>
            </tr>
        </tbody>
      </Table>
    </Container>
  )
}

const textColor = (index: number): string => {
  if (index == 1) return "text-go";
  return "text-light";
}

export default Leaderboards;