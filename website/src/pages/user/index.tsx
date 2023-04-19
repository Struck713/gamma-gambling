import { useEffect, useState } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";

import styles from "../../styles/statistics.module.css"
import { LoadingSpinner } from "@/components/loading";
import { Transaction } from "@/lib/models";
import { toast } from "react-hot-toast";
import { Container, Table, ButtonGroup, Button } from 'react-bootstrap';
import moment from "moment";

import Image from 'next/image';
import { Images } from "@/components/images";

interface Statistics {

  recent: Transaction;
  all: Transaction[];

}

// Statistics page
const Statistics = () => {

  const [loading, setLoading] = useState<boolean>();
  const [statistics, setStatistics] = useState<Statistics>();

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
      <h1 className={`text-light ${styles.h1}`}>
        <span className={styles.balance}>{statistics?.recent.total}</span> <Image className={styles.coin} src={Images.GammaCoin} alt="GAMMA COIN" />
      </h1>
      <Container style={{ minHeight: "10rem" }}>
        <Table className="text-light bg-primary" >
          <thead>
            <tr className={styles.tr}>
              <th>REASON</th>
              <th>BET</th>
              <th>CHANGE</th>
              <th>TOTAL</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {statistics?.all.map((tran, index) =>
              <tr key={index}>
                <td>{tran.reason}</td>
                <td>{tran.bet_amt}</td>
                <StatisticChange transaction={tran} />
                <td>{tran.total}</td>
                <td>{moment(tran.date_changed).format("MM/DD/YYYY HH:mm A")}</td>
              </tr>
            )}
          </tbody>
        </Table>
        <ButtonGroup className="me-2" aria-label="First group">
          <Button>1</Button> <Button>2</Button> <Button>3</Button>{' '}
          <Button>4</Button>
        </ButtonGroup>
      </Container>
    </>
  )
}

const StatisticChange = ({ transaction: { bet_amt, return_amt } } : { transaction: Transaction }) => {
  if (return_amt == 0) return <td className="text-danger">-{bet_amt}</td>;
  if (return_amt > 0) return <td className="text-success">+{return_amt ?? 0}</td>;
  return <td>NONE</td>;
}

export default Statistics;