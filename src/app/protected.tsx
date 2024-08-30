import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProtectedPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return <div>Loading...</div>;

  return <div>Página Protegida: Somente usuários logados podem ver isso.</div>;
};

export default ProtectedPage;
