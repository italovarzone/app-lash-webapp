'use client';

import { useRouter, usePathname } from 'next/navigation'; // Importa o roteador de navegação

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Hook para pegar a URL atual

  const handleNavigation = (content: 'clientes' | 'listagem') => {
    if (content === 'clientes') {
      router.push('/cadastro');
    } else if (content === 'listagem') {
      router.push('/listagem');
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 h-screen">
      <h2 className="text-2xl font-bold mb-6">Lash Designer</h2>
      <ul>
        <li className="mb-4">
          <button
            onClick={() => handleNavigation('clientes')}
            className={`text-white hover:bg-gray-700 px-4 py-2 block w-full text-left ${pathname === '/cadastro' ? 'bg-gray-700' : ''}`}
          >
            Cadastro de Clientes
          </button>
        </li>
        <li className="mb-4">
          <button
            onClick={() => handleNavigation('listagem')}
            className={`text-white hover:bg-gray-700 px-4 py-2 block w-full text-left ${pathname === '/listagem' ? 'bg-gray-700' : ''}`}
          >
            Listagem de Clientes
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
