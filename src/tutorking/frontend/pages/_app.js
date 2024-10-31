"use client"

import '../styles/globals.css'; 
import Navbar from '../components/navbar'; 
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Navbar /> 
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
