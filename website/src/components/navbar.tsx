import Link from 'next/link';
import { useCurrentUser } from "@/lib/user";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { fetcher } from '@/lib/fetcher';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

const DropdownGuest = () => {
  return(
  <NavDropdown title="Profile" id="profile-dropdown">
    <NavDropdown.Item as={Link} href="/account/login">Login</NavDropdown.Item>
    <NavDropdown.Item as={Link} href="/account/register">Sign Up</NavDropdown.Item>
  </NavDropdown>
  )
}

const DropdownUser = ({user, mutate} : any) => {
  const onSignOut = useCallback(async () => {
    try {
      await fetcher('/api/user/auth', {
        method: 'DELETE',
      });
      toast.success('You have been signed out');
      mutate({ user: null });
    } catch (e: any) {
      toast.error(e.message);
    }
  }, [mutate]);
  return(
  <NavDropdown title={`Welcome back, ${user.username}`} id="profile-dropdown">
    <NavDropdown.Item onClick={onSignOut}>Logout</NavDropdown.Item>
  </NavDropdown>
  )
}

const TopNavbar = () => {
  const { data: { user } = {}, mutate, isValidating } = useCurrentUser();
  return (
    <Navbar bg="primary" variant="dark" expand="sm">
      <Container>
        <Navbar.Brand as={Link} href="/">GAMMA GAMBLING</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid justify-content-end">
              <Nav.Link as={Link} href="/">Home</Nav.Link>
              <NavDropdown title="Games" id="games-dropdown">
                <NavDropdown.Item as={Link} href="/games/slots">Slots</NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/games/plinko">Plinko</NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/games/blackjack">Blackjack</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} href="/stats">Stats</Nav.Link>
              {user ? <DropdownUser user={user} mutate={mutate}/> : <DropdownGuest/>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;