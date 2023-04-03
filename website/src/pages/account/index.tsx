import { useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";

// The profile page, showing transactions or whatever
const AccountProfile = () => {
  const { data, error, mutate } = useCurrentUser();
  const router: NextRouter = useRouter();
  useEffect(() => {
    if (!(data || error)) return;
    if (!data.user) router.replace('login');
  }, [router, data, error]);

console.log(data);

  return (
    <>
      {data?.user ? <p className="text-light">You are signed in as: {data.user.username}</p> : null }
    </>
  )
}

export default AccountProfile;