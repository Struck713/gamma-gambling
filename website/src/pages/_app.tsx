import Head from 'next/head'
import FullNavbar from '@/components/navbar';
import Notifications from '@/components/notifications';

import type { AppProps } from 'next/app';
import { SSRProvider } from 'react-bootstrap';

import '@/global.scss'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {/* <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style> */}
      <Head>
        <title>Gamma Gambling</title>
        <meta name="description" content="Make your money go up!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#200542" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=KoHo&display=swap" rel="stylesheet" />
      </Head>

      <SSRProvider>
        <FullNavbar />
      </SSRProvider>
      
      <Component {...pageProps} />
      
      <Notifications />
    </>
  )
}

export default App;
