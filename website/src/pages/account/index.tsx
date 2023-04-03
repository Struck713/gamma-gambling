import { useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { useCurrentUser } from "@/lib/user";

// The profile page, showing transactions or whatever
const AccountProfile = () => {
  const { data, error, mutate } = useCurrentUser();
  const router: NextRouter = useRouter();
  useEffect(() => {
    if (!(data || error)) return;
    if (!data.user) router.replace('/account/profile');
  }, [router, data, error]);

  return (
    <>
      <p className="text-light">{data?.user ? `You are signed in as: ${data.user.username}`: ""}</p>
    </>
  )
}

export default AccountProfile;