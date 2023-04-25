import { useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";
import { Container } from "react-bootstrap";

// The profile page, showing transactions or whatever
const AccountProfile = () => {
  const { data, error, mutate } = useCurrentUser();
  const router: NextRouter = useRouter();
  
  useEffect(() => {
    if (!(data || error)) return;
    if (!data.user) router.replace('/user/login');
  }, [router, data, error]);

  return (
    <Container className="jumbotron">
      <hgroup className="text-light text-center">
        <h1>Hello, {data?.user ? data.user.username : "user"}!</h1>
        <h2>You can change your settings from this page.</h2>
      </hgroup>
    </Container>
  )
}

export default AccountProfile;