import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";

import { Images } from "../components/images";

import styles from "../styles/index.module.css"

const Home = () => {
  return (
    <Container className={`text-light body-center jumbotron ${styles.main}`}>
      <Row>
        <Col className="my-auto">
          <h1 className="display-4">FEEL THE RUSH WITHOUT THE &euro;O&#36;T</h1> {/* html character entities */}
          <p className="lead">Gamma coins are a currency that hold no real value which creates an enjoyable risk-free enviroment for new and experienced players</p>
        </Col>
        <Col className={`justify-contents-center my-auto ${styles.centerColContents}`}>
          <Image className={styles.coin} src={Images.GammaCoin} alt="GAMMA COIN" />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
