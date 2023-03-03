import TopNavbar from '@/components/navbar';
import '@/style/main.scss'
//import "bootstrap/dist/js/bootstrap.bundle.min";

import type { AppProps } from 'next/app'


const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <TopNavbar />
      <Component {...pageProps} />
    </>
  )
}

export default App;
