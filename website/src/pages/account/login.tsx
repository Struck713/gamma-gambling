
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";

// The login page, you know what it does
const AccountLogin = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const router = useRouter();

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
    })

    return (
      <div className="jumbotron text-light" >
        <Form className="bg-primary rounded border border-secondary" style={{ padding: "3rem" }}>
          <Form.Group className="mb-3" controlId="emailField">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We&apos;ll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="passwordField">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="staySignedInCheckbox">
            <Form.Check type="checkbox" label="Stay signed in?" />
          </Form.Group>
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    )
  }
  
  export default AccountLogin;