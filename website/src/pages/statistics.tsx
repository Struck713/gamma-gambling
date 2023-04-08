import { useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";

// Statistics page
const AccountProfile = () => {
  const { data, error, mutate } = useCurrentUser();
  const router: NextRouter = useRouter();
  
  useEffect(() => {
    if (!(data || error)) return;
    if (!data.user) router.replace('/user/login');
  }, [router, data, error]);

  return (
    <>
      <h1>Stats hey</h1>
    </>
  )
}

export default AccountProfile;