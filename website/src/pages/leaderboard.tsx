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

  })

  if (loading) return <LoadingSpinner />

  return (
    <Container className="jumbotron">
      <Table className="text-light bg-primary border-primary p-5" bordered>
        <tbody>
          {leaderboard.map((leader, index) => 
            <tr>
              <td>#{index + 1}</td>
              <td>{leader.username}</td>
              <td>{leader.total}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  )
}

export default Leaderboards;