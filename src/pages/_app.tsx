import Head from 'next/head'
import TopNavbar from '@/components/navbar';

import '@/style/main.scss'
//import "bootstrap/dist/js/bootstrap.bundle.min";

import type { AppProps } from 'next/app'


const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Gamma Gambling</title>
        <meta name="description" content="Make your money go up!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopNavbar />
      <Component {...pageProps} />
    </>
  )
}

export default App;
