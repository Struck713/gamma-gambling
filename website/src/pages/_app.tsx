import Head from 'next/head'
import FullNavbar from '@/components/navbar';
import Notifications from '@/components/notifications';

import type { AppProps } from 'next/app';
import { SSRProvider } from 'react-bootstrap';

import '@/global.scss'

const TITLE = "Gamma Gambling";
const DESCRIPTION = "Make your money go up!";
const IMAGE = "/assets/images/og/logo.png";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {/* <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style> */}
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="og:title" content={TITLE} />
        <meta name="og:description" content={DESCRIPTION} />
        <meta name="og:image" content={IMAGE} />
        <meta name="theme-color" content="#200542" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
