import Head from 'next/head'
import { Alert } from 'react-bootstrap';

const Home = () => {
  return (
    <>
      <Head>
        <title>Gamma Gambling</title>
        <meta name="description" content="Make your money go up!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ margin: '1rem' }}>
        <Alert key="warning" variant="danger">
          Carson Smith smells!
        </Alert>
      </div>
    </>
  )
}

export default Home;
