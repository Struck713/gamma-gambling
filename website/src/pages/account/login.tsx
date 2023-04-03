
import { fetcher } from "@/lib/fetcher";
import { useCurrentUser } from "@/lib/user";
import { NextRouter, useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";

// The login page, you know what it does
const AccountLogin = () => {
    const emailRef: any = useRef();
    const passwordRef: any = useRef();
    const router: NextRouter = useRouter();

    const [isLoading, setLoading] = useState(false);
    const { data: { user } = {}, mutate, isValidating } = useCurrentUser();
    
    useEffect(() => {
      if (isValidating) return;
      if (user) router.replace('/account');
    }, [user, router, isValidating]);

    const onSubmit = useCallback(
      async (e: any) => {
        setLoading(true);
        e.preventDefault();
        
        try {
          const response = await fetcher('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: emailRef.current.value,
              password: passwordRef.current.value,
            }),
          });

          mutate({ user: response.user }, false);
          console.log('You have been logged in.');
        } catch (error: any) {
          console.log(error.message);
        } finally {
          setLoading(false);
        }
      },
      [mutate]
    );

    return (
      <div className="jumbotron text-light" >
        <Form onSubmit={onSubmit} className="bg-primary rounded border border-secondary" style={{ padding: "3rem" }}>
          <Form.Group className="mb-3" controlId="emailField">
            <Form.Label>Email address</Form.Label>
            <Form.Control ref={emailRef} type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We&apos;ll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="passwordField">
            <Form.Label>Password</Form.Label>
            <Form.Control ref={passwordRef} type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="staySignedInCheckbox">
            <Form.Check type="checkbox" label="Stay signed in?" />
          </Form.Group>
          <Button variant="secondary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    )
  }
  
  export default AccountLogin;