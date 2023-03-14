import Link from 'next/link';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const TopNavbar = () => {
  return (
    <Navbar bg="primary" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Gamma Gambling</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            <NavDropdown title="Games" id="games-dropdown">
              <NavDropdown.Item as={Link} href="/games/roulette">Roulette</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/games/plinko">Plinko</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/games/blackjack">Blackjack</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Profile" id="profile-dropdown" className="ms-auto">
              <NavDropdown.Item as={Link} href="/account/login">Login</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;