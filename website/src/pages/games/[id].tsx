import { PageLoadingSpinner } from "@/components/loading";
import { fetcher } from "@/lib/fetcher";
import { GameHistory } from "@/lib/models";
import { Utils } from "@/lib/utils";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Col, Row, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";

const Game = () => {

    const router = useRouter();
    const { id } = router.query;

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ data, setData ] = useState<GameHistory>();

    useEffect(() => {
      const loadGameData = async () => {
        if (!id) return;

        const data = await fetcher(`/api/games/${id}`);
        if (data) setData(data as GameHistory);
        else toast.error("There was an error when trying to load this page.");
        setLoading(false);
      }

      setLoading(true);
      loadGameData();
    }, [ id ]);

    if (loading || !data) return <PageLoadingSpinner />;

    return (
      <Container className="jumbotron text-light">
        <div className="bg-primary rounded border border-secondary p-5">
          <h1>{data.name} at {moment(data.date_of).format(Utils.DATE_FORMAT)}</h1>
          <Table className={`text-light bg-primary`} >
            <thead>
              <tr>
                <th>USERNAME</th>
                <th>BET</th>
                <th>RETURN</th>
              </tr>
            </thead>
            <tbody>
              {data.players.map((player, index) => (
                <tr key={index}>
                  <td>{player.username}</td>
                  <td>{Utils.format(player.betAmount)}</td>
                  <td>{Utils.format(player.returnAmount)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    )
  }
  
export default Game;