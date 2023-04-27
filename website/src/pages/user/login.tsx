import toast from "react-hot-toast";

import { NextRouter, useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";

import { fetcher } from "@/lib/fetcher";
import { useCurrentUser } from "@/lib/user";
import { PageLoadingSpinner, LoadingSpinner } from "@/components/loading";

// The login page, you know what it does
const AccountLogin = () => {
    const emailRef: any = useRef();
    const passwordRef: any = useRef();
    const router: NextRouter = useRouter();

    const [isLoading, setLoading] = useState(false);
    const { data: { user } = {}, mutate } = useCurrentUser();

    const onSubmit = useCallback(
      async (e: any) => {
        setLoading(true);
        e.preventDefault();
        
        try {
          const response = await fetcher('/api/user/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: emailRef.current.value,
              password: passwordRef.current.value,
            }),
          });

          mutate({ user: response.user }, false);
          toast.success('You have been logged in.');
          
        } catch (error: any) {
          toast.error("Invalid email or password.");
        } finally {
          setLoading(false);
        }
      },
      [mutate]
    );

    if (user) {
      router.replace('/user');
      return <PageLoadingSpinner />;
    }

    return (
      <div className="jumbotron text-light" >
        <Form onSubmit={onSubmit} className="bg-primary rounded border border-secondary p-5">
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
          <Button style={{width: '4rem'}} disabled={isLoading} variant="secondary" type="submit">{isLoading ? <LoadingSpinner /> : "Login"}</Button>
        </Form>
      </div>
    )
  }
  
  export default AccountLogin;