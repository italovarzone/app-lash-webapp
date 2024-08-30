'use client';

import Sidebar from '../components/Sidebar';
import ClienteList from '../components/ClienteList';

const ListagemClientesPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 pt-6 pr-6 pb-0 pl-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Listagem de Clientes</h1>
        <ClienteList />
      </main>
    </div>
  );
};

export default ListagemClientesPage;
