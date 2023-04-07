import Head from 'next/head'
import TopNavbar from '@/components/navbar';
import Notifications from '@/components/notifications';

import type { AppProps } from 'next/app';
import { SSRProvider } from 'react-bootstrap';

import '@/style/main.scss'

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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SSRProvider>
        <TopNavbar />
      </SSRProvider>
      
      <Component {...pageProps} />
      
      <Notifications />
    </>
  )
}

export default App;
