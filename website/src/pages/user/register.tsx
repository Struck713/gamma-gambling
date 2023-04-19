import toast from 'react-hot-toast';

import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";

import { fetcher } from "@/lib/fetcher";
import { useCurrentUser } from "@/lib/user";
import { LoadingSpinner } from '@/components/loading';

// The login page, you know what it does
const AccountRegister = () => {
  
    const emailRef: any = useRef(null);
    const usernameRef: any = useRef(null);
    const passwordRef: any = useRef(null);
    const confirmPasswordRef: any = useRef(null);

    const router = useRouter();
    const { data: { user } = {}, mutate, isValidating } = useCurrentUser();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(
        async (e: any) => {
          e.preventDefault();

          try {
            setIsLoading(true);
            const response = await fetcher('/api/user/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: emailRef.current.value,
                password: passwordRef.current.value,
                confirmPassword: confirmPasswordRef.current.value,
                username: usernameRef.current.value,
              }),
            });

            mutate({ user: response.user }, false);
            router.replace('/user');

          } catch (e: any) {
            if (e.message) toast.error(e.message);
            else toast.error("Invalid email or password.");
          } finally {
            setIsLoading(false);
          }
        },
        [mutate, router]
    );

    if (isValidating) return <LoadingSpinner />;
    if (user) {
      router.replace('/user');
      return <LoadingSpinner />;
    }

    return (
      <div className="jumbotron text-light" >
        <Form onSubmit={onSubmit} className="bg-primary rounded border border-secondary p-5">
          <Row className="mb-3">
            <Form.Group as={Col} controlId="emailField">
                <Form.Label>Email address</Form.Label>
                <Form.Control ref={emailRef} type="email" placeholder="Enter email" />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="usernameField">
                <Form.Label>Username</Form.Label>
                <Form.Control ref={usernameRef} type="username" placeholder="Enter username" />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="passwordField">
                <Form.Label>Password</Form.Label>
                <Form.Control ref={passwordRef} type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group as={Col} controlId="confirmPasswordField">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control ref={confirmPasswordRef} type="password" placeholder="Confirm Password" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Col>
              <Button style={{width: '6rem'}} disabled={isLoading} variant="secondary" type="submit">{isLoading ? <LoadingSpinner /> : "Register"}</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  
  export default AccountRegister;