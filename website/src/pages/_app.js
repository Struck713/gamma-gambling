// pages/_app.js
// The authentication state exposed by UserProvider can be accessed in any component using the useUser() hook.
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
