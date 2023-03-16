import Image from 'next/image'
import { Alert } from 'react-bootstrap';

import background from '../../public/assets/images/background.svg'

const Home = () => {
  return (
    <>
      <Image src={background} alt="matt" />
      <div style={{ margin: '1rem' }}>
      </div>
    </>
  )
}

export default Home;
