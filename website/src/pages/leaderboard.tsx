import { LoadingSpinner } from "@/components/loading";
import { Leader } from "@/lib/models";
import { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";

// The Leaderboard
const Leaderboards = () => {

  const [ loading, setLoading ] = useState<boolean>();
  const [ leaderboard, setLeaderboard ] = useState<Leader[]>([]);

  useEffect(() => {

    const loadLeaderboard = async () => {
      const res = await fetch('/api/statistics/leaderboard');
      const json = await res.json();
      setLeaderboard(json);
    }

    setLoading(true);
    loadLeaderboard();
    setLoading(false);

  }, []);

  if (loading) return <LoadingSpinner />

  return (
    <Container className="jumbotron">
      <Table className="text-light bg-primary border-primary p-5" bordered>
        <thead>
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