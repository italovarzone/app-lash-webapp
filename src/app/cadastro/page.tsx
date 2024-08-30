'use client';

import Sidebar from '../components/Sidebar';
import ClienteForm from '../components/ClienteForm';

const CadastroPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Cadastro de Clientes</h1>
        <ClienteForm />
      </main>
    </div>
  );
};

export default CadastroPage;
