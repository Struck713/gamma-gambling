import { FormEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { LoadingSpinner } from "@/components/loading";
import { toast } from "react-hot-toast";
import { fetcher } from "@/lib/fetcher";

// The profile page, showing transactions or whatever
const AccountProfile = () => {

  const { data, error, mutate } = useCurrentUser();
  const router: NextRouter = useRouter();

  const [ loading, setLoading ] = useState(false);
  
  useEffect(() => {
    if (!(data || error)) return;
    if (!data.user) router.replace('/user/login');
  }, [router, data, error]);

  return (
    <Container className="jumbotron text-light">
      <ChangePassword loading={loading} />
    </Container>
  )
}

const ChangePassword = ({ loading } : { loading: boolean}) => {

  const currentPasswordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const newPasswordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const confirmNewPasswordRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetcher('/api/user/changepassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: currentPasswordRef.current?.value,
          newPassword: newPasswordRef.current?.value,
          confirmNewPassword: confirmNewPasswordRef.current?.value
        })
      });
      toast.success(res.message);
    } catch (e: any) {
      if (e.message) toast.error(e.message);
      else toast.error("Something went wrong.");
    }
  }

  return (
    <Form onSubmit={onSubmit} className="bg-primary rounded border border-secondary p-5">
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="passwordField">
            <Form.Label>Current Password</Form.Label>
            <Form.Control ref={currentPasswordRef} type="password" placeholder="Current Password" />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="passwordField">
            <Form.Label>New Password</Form.Label>
            <Form.Control ref={newPasswordRef} type="password" placeholder="New Password" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="passwordField">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control ref={confirmNewPasswordRef} type="password" placeholder="Confirm New Password" />
          </Form.Group>
        </Col>
      </Row>
      
      <Button disabled={loading} variant="secondary" type="submit">{loading ? <LoadingSpinner /> : "Change Password"}</Button>
    </Form>
  )
}

export default AccountProfile;