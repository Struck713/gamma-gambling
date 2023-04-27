import { PageLoadingSpinner } from "@/components/loading";
import { fetcher } from "@/lib/fetcher";
import { GameHistory } from "@/lib/models";
import { Utils } from "@/lib/utils";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Col, Row, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";

import styles from "@/styles/leaderboard.module.css";
import { Images } from "@/components/images";
import Image from "next/image";
import { InlineCoin } from "@/components/coin";

const Game = () => {

    const router = useRouter();
    const { id } = router.query;

    const [ loading, setLoading ] = useState<boolean>(false);
    const [ data, setData ] = useState<GameHistory>();

    useEffect(() => {
      const loadGameData = async () => {
        if (!id) return;

        const data = await fetcher(`/api/games/${id}`);
        console.log(data);
        if (data) setData(data as GameHistory);
        else router.replace("/404");
        setLoading(false);
      }

      setLoading(true);
      loadGameData();
    }, [ id, router ]);

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
                  <td><InlineCoin amount={player.betAmount} /></td>
                  <td><InlineCoin amount={player.returnAmount} /></td>
                </tr>
              ))}
              <tr className="bg-primary">
                  <td>TOTALS</td>
                  <td><InlineCoin amount={data.totalBet}/></td>
                  <td><InlineCoin amount={data.totalReturn}/></td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Container>
    )
}



export default Game;