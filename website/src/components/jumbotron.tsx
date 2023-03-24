import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";

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
                    <Col style={{ verticalAlign: 'middle' }}>
                        <Row style={{paddingBottom: "5px"}}><Image src={Images.Crash} alt="Crash" style={{height: "auto", width:"50%"}} /></Row>
                        <Row style={{paddingBottom: "5px"}}><Image src={Images.Slots} alt="Slots" style={{height: "auto", width:"50%"}} /></Row>
                        <Row style={{paddingBottom: "5px"}}><Image src={Images.Roulette} alt="Roulette" style={{height: "auto", width:"50%"}} /></Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Jumbotron;