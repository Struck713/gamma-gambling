import { fetcher } from "@/lib/fetcher";
import { useCurrentUser } from "@/lib/user";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";


// The login page, you know what it does
const AccountRegister = () => {
    const emailRef: any = useRef(null);
    const passwordRef: any = useRef(null);
    const usernameRef: any = useRef(null);

    const { mutate } = useCurrentUser();

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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
                username: usernameRef.current.value,
              }),
            });

            mutate({ user: response.user }, false);
            router.replace('/profile');

          } catch (e: any) {
            console.log(e.message);
            //toast.error(e.message);
          } finally {
            setIsLoading(false);
          }
        },
        [mutate, router]
      );

    return (
      <div className="jumbotron text-light" >
        <Form onSubmit={onSubmit} className="bg-primary rounded border border-secondary" style={{ padding: "3rem" }}>
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
            <Form.Group as={Col} controlId="passwordField">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" />
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Col>
                <Button variant="secondary" type="submit">Create an account</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  
  export default AccountRegister;