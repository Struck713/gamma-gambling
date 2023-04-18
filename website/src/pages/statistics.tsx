import { useEffect, useState } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";

import Styles from "../styles/statistics.module.css"
import { LoadingSpinner } from "@/components/loading";
import { Transaction } from "@/lib/models";
import { toast } from "react-hot-toast";
import Table from 'react-bootstrap/Table';
import moment from "moment";

interface Statistics {

  recent: Transaction;
  all: Transaction[];

}

// Statistics page
const Statistics = () => {

  const [ loading, setLoading ] = useState<boolean>();
  const [ statistics, setStatistics ] = useState<Statistics>();

  const { data, error, isValidating } = useCurrentUser();
  const router: NextRouter = useRouter();
  
  useEffect(() => {
    if (!(data || error)) return;
    if (!data.user) { router.replace('/user/login'); return; }

    const loadTransations = async () => {
      const res = await fetch('/api/statistics');
      const data = await res.json();
      if (data) setStatistics(data as Statistics);
      else toast.error("Something went wrong when loading your statistics..")
    }

    setLoading(true);
    loadTransations();
    setLoading(false);
  }, [router, data, error]);

  if (isValidating || loading || !data.user) return <LoadingSpinner />;

  return (
    <>
      <h1 className={`text-light ${Styles.h1}`}>{statistics?.recent.total} GAMMA COIN</h1>
      <div className={Styles.table}>
        <Table hover  variant="dark" >
          <thead>
            <tr className={Styles.tr}>
              <th>GAME</th>
              <th>BET</th>
              <th>REASON</th>
              <th>CHANGE</th>
              <th>TOTAL</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {statistics?.all.map(tran => 
              <tr>
                <td>{tran.game_id ?? "NONE"}</td>
                <td>{tran.bet_amt}</td>
                <td>{tran.reason}</td>
                <td>{tran.loss_amt ? `-${tran.loss_amt}` : `+${tran.win_amt}`}</td>
                <td>{tran.total}</td>
                <td>{moment(tran.date_changed).format("MM/DD/YYYY HH:mm A")}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default Statistics;