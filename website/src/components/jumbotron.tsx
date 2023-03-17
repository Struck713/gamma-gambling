import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";

interface JumbotronProps {
    title: string,
    children: string
}

import Kosilka from '../../public/assets/images/kosilka.jpg';

const Jumbotron = ({ title, children } : JumbotronProps) => {

    return (
        <div className="jumbotron jumbotron-fluid text-light"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Container>
                <Row>
                    <Col>
                        <h1 className="display-4">{title}</h1>
                        <p className="lead">{children}</p>
                    </Col>
                    <Col>
                        <Image src={Kosilka} alt="Kolsilka" style={{height: "50%", width:"75%"}} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Jumbotron;