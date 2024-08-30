import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && router.pathname !== '/login' && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [router]);  

  return <Component {...pageProps} />;
};

export default MyApp;
