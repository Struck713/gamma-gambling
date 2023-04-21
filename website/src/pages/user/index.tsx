import { useEffect, useState } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";

import styles from "../../styles/statistics.module.css"
import { PageLoadingSpinner } from "@/components/loading";
import { Transaction } from "@/lib/models";
import { toast } from "react-hot-toast";
import { Container, Table, ButtonGroup, Button } from 'react-bootstrap';
import moment from "moment";

import Image from 'next/image';
import { Images } from "@/components/images";

interface Statistics {

  recent: Transaction;
  page: StatisticsPage;

}

interface StatisticsPage {

  index: Transaction;
  pageRows: Transaction[];

}

// Statistics page
const Statistics = () => {

  const [ loading, setLoading ] = useState<boolean>();
  const [ page, setPage ] = useState<number>(1);
  const [ statistics, setStatistics ] = useState<Statistics>();

  const { data: user, error, isValidating } = useCurrentUser();
  const router: NextRouter = useRouter();

  useEffect(() => {
    if (error) return;
    if (!user) { router.replace('/user/login'); return; }

    handlePageChange(1);
  }, [router, user, error]);

  const loadTransations = async (page: number) => {
    const res = await fetch(`/api/statistics?page=${page}`);
    const data = await res.json();
    if (data) setStatistics(data as Statistics);
    else toast.error("Something went wrong when loading your statistics..")
    setLoading(false);
  }

  const handlePageChange = (page: number) => {
    if (page < 1) setPage(1);
    else setPage(page);

    setLoading(true);
    loadTransations(page);
  }

  if (isValidating || loading || !user) return <PageLoadingSpinner />;

  return (
    <>
      <h1 className={`text-light ${styles.h1}`}>
        <span className={styles.balance}>{statistics?.recent.total}</span> <Image className={styles.coin} src={Images.GammaCoin} alt="GAMMA COIN" />
      </h1>
      <Container style={{ minHeight: "10rem" }}>
        <Table className={`text-light bg-primary ${styles.table}`} >
          <thead  className={styles.thead}>
            <tr>
              <th>REASON</th>
              <th>BET</th>
              <th>CHANGE</th>
              <th>TOTAL</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {statistics?.page.pageRows.map((tran, index) =>
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
          <Button onClick={() => handlePageChange(page - 1)}>{"<--"}</Button>
          <Button onClick={() => handlePageChange(page + 1)}>{"-->"}</Button>
        </ButtonGroup>
      </Container>
    </>
  )
}

const StatisticChange = ({ transaction: { bet_amt, return_amt } } : { transaction: Transaction }) => {
  if (return_amt < 0) return <td className="text-danger">-{bet_amt}</td>;
  else if (return_amt > 0) return <td className="text-success">+{return_amt ?? 0}</td>;
  else return <td>NONE</td>;
}

export default Statistics;