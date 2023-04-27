import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCallback } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

import { useCurrentUser } from "@/lib/user";
import { fetcher } from '@/lib/fetcher';

import styles from "../styles/navbar.module.css"
import { Images } from "@/components/images"

const GuestNavbar = () => {
  return (
    <>
      <Nav.Link as={Link} href="/user/login">Login</Nav.Link>
      <span className="navbar-text">or</span>
      <Nav.Link as={Link} href="/user/register">Sign up</Nav.Link>
    </>
  )
}

const UserNavbar = ({ user, mutate }: any) => {
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

  return (
    <>
      <NavDropdown title="Games" id="games-dropdown">
        <NavDropdown.Item as={Link} href="/games/rocketride">Rocket Ride</NavDropdown.Item>
        <NavDropdown.Item as={Link} href="/games/roulette">Roulette</NavDropdown.Item>
        <NavDropdown.Item as={Link} href="/games/blackjack">Blackjack</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title={`Welcome back, ${user.username}`} id="profile-dropdown">
        <NavDropdown.Item as={Link} href="/user">Account</NavDropdown.Item>
        <NavDropdown.Item as={Link} href="/user/settings">Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item as={Link} href="/" onClick={onSignOut}>Logout</NavDropdown.Item>
      </NavDropdown>
    </>
  )
}

const FullNavbar = () => {
  const { data: { user } = {}, mutate, isValidating } = useCurrentUser();
  return (
    <Navbar className={styles.navbar} sticky="top" bg="primary" variant="dark" expand="md">
      <Container className="bg-primary">
        <Navbar.Brand as={Link} href="/">
          <div className="d-flex align-items-center">
            <Image className={styles.logo} src={Images.Logo} alt={"Gamma Gambling Logo"} />
            GAMMA GAMBLING
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div className="text-light d-flex align-items-center container-fluid justify-content-center">
          <Nav.Link as={Link} href="/user/index" className={styles.balance}>
            <Image className={styles.coin} src={Images.GammaCoin} alt="GAMMA COIN" />
            190002
          </Nav.Link>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="container-fluid justify-content-end">
            <Nav.Link as={Link} href="/leaderboard">Leaderboard</Nav.Link>
            {user ? <UserNavbar user={user} mutate={mutate} /> : <GuestNavbar />}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default FullNavbar;