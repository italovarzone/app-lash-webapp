'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Importa o roteador de navegação
import ClienteForm from '../components/ClienteForm';
import ClienteList from '../components/ClienteList';
import Sidebar from '../components/Sidebar'; // Importa o componente Sidebar

const Home = () => {
  const router = useRouter();
  const pathname = usePathname(); // Hook para pegar a URL atual

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-gray-100">
        {pathname === '/cadastro' && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Cadastro de Clientes</h1>
            <ClienteForm />
          </div>
        )}
        {pathname === '/listagem' && (
          <ClienteList />
        )}
        {!['/cadastro', '/listagem'].includes(pathname) && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Bem-vindo à plataforma Lash Designer</h1>
            <p className="text-lg">Selecione uma opção na barra lateral para começar.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
