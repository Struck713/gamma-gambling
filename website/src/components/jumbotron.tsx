import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";

import styles from "../styles/jumbotron.module.css"
import { Images } from "./images";

const Jumbotron = ({ title, children } : {title: string, children: string }) => {

    return (
        <div className={`jumbotron text-light ${styles.main}`}>
            <Container>
                <Row>
                    <Col className="my-auto">
                        <h1 className="display-4">{title}</h1>
                        <p className="lead">{children}</p>
                    </Col>
                    <Col className="justify-contents-center my-auto">
                        <Row><Image className={styles.image} src={Images.Crash} alt="Crash" /></Row>
                        <Row><Image className={styles.image} src={Images.Roulette} alt="Roulette" /></Row>
                        <Row><Image className={styles.image} src={Images.Blackjack} alt="Blackjack" /></Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Jumbotron;