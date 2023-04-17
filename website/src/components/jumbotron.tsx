import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";

import Styles from "../styles/jumbotron.module.css"

interface JumbotronProps {
    title: string,
    children: string
}

import { Images } from "./images";

const Jumbotron = ({ title, children } : JumbotronProps) => {

    return (
        <div className="jumbotron text-light">
            <Container>
                <Row>
                    <Col>
                        <h1 className="display-4">{title}</h1>
                        <p className="lead">{children}</p>
                    </Col>
                    <Col className="justify-contents-center">
                        <Row><Image className={Styles.image} src={Images.Crash} alt="Crash" /></Row>
                        <Row><Image className={Styles.image} src={Images.Slots} alt="Roulette" /></Row>
                        <Row><Image className={Styles.image} src={Images.Roulette} alt="Blackjack" /></Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Jumbotron;