import { useEffect, useState } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";

import styles from "../../styles/account.module.css"
import { PageLoadingSpinner } from "@/components/loading";
import { Transaction } from "@/lib/models";
import { toast } from "react-hot-toast";
import { Container, Table, ButtonGroup, Button } from 'react-bootstrap';
import moment from "moment";

import Image from 'next/image';
import { Images } from "@/components/images";
import { Utils } from "@/lib/utils";

interface Transactions {

  recent: Transaction;
  page: TransactionsPage;
  totalPages: number;

}

interface TransactionsPage {

  index: Transaction;
  rows: Transaction[];

}

// Account page
const Account = () => {

  const [ loading, setLoading ] = useState<boolean>();
  const [ page, setPage ] = useState<number>(0);
  const [ total, setTotal ] = useState<Transaction>();
  const [ account, setAccount ] = useState<Transactions>();

  const { data: user, error, isValidating } = useCurrentUser();
  const router: NextRouter = useRouter();

  useEffect(() => {
    if (error) return;
    if (!user) { router.replace('/user/login'); return; }

    loadTotal();
    handlePageChange(0);
  }, [router, user, error]);

  const loadTransations = async (page: number) => {
    const res = await fetch(`/api/transactions?page=${page}`);
    const data = await res.json();
    if (data) setAccount(data as Transactions);
    else toast.error("Something went wrong when loading your account..")
    setLoading(false);
  }

  const loadTotal = async () => {
    const res = await fetch(`/api/transactions/recent`);
    const data = await res.json();
    if (data) setTotal(data as Transaction);
    else toast.error("Something went wrong when loading your total..")
    setLoading(false);
  }

  const handlePageChange = (page: number) => {
    if (page < 0) setPage(0);
    else setPage(page);

    setLoading(true);
    loadTransations(page);
  }

  if (isValidating || !user) return <PageLoadingSpinner />;

  return (
    <>
      <h1 className={`text-light align-items-center ${styles.h1}`}>
      <Image className={styles.coin} src={Images.GammaCoin} alt="GAMMA COIN" /> <span className={styles.balance}>{total?.total.toLocaleString()}</span>
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
            {!loading && account ? account.page.rows.map((tran, index) =>
              <tr key={index}>
                <td>{tran.reason}</td>
                <td>{Utils.format(tran.bet_amt)}</td>
                <Change transaction={tran} />
                <td>{Utils.format(tran.total)}</td>
                <td>{moment(tran.date_changed).format("MM/DD/YYYY hh:mm A")}</td>
              </tr>
            ) : <PageLoadingSpinner />}
          </tbody>
        </Table>
        <ButtonGroup className="me-2" aria-label="Page Buttons Group">
          {Array.from(Array(account?.totalPages).keys()).map(index => <Button key={index} active={index == page} onClick={() => handlePageChange(index)}>{index + 1}</Button>)}
        </ButtonGroup>
      </Container>
    </>
  )
}

const Change = ({ transaction: { bet_amt, return_amt } } : { transaction: Transaction }) => {
  if (return_amt < 0) return <td className="text-danger">-{Utils.format(bet_amt)}</td>;
  else if (return_amt > 0) return <td className="text-success">+{Utils.format(return_amt ?? 0)}</td>;
  else return <td>NONE</td>;
}

export default Account;