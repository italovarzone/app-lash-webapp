import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa o roteador de 'next/navigation'
import { FaEdit } from 'react-icons/fa'; // Ícone de lápis
import { Cliente } from '../models/Cliente'; // Importa a interface Cliente
import Sidebar from './Sidebar';

const ClienteList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]); // Inicializa como um array vazio
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Roteador para redirecionamento
  const limit = 10; // Número de clientes por página

  useEffect(() => {
    fetchClientes(currentPage);
  }, [currentPage]);

  const fetchClientes = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/clientes?page=${page}&limit=${limit}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setClientes(data);
      } else if (data.data && Array.isArray(data.data)) {
        setClientes(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('Formato de resposta inesperado:', data);
        setClientes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleEditCliente = (cliente: Cliente) => {
    // Redireciona para a página de cadastro com os dados do cliente para edição
    router.push(`/cadastro?cliente=${encodeURIComponent(JSON.stringify(cliente))}`);
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-left bg-gray-100">Nome do Cliente</th>
                <th className="py-3 px-4 border-b text-left bg-gray-100">Data de Nascimento</th>
                <th className="py-3 px-4 border-b text-left bg-gray-100">Número de Telefone</th>
                <th className="py-3 px-4 border-b text-left bg-gray-100">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-left">{cliente.nome}</td>
                  <td className="py-3 px-4 border-b text-left">{new Date(cliente.dataNascimento).toLocaleDateString()}</td>
                  <td className="py-3 px-4 border-b text-left">{cliente.telefone}</td>
                  <td className="py-3 px-4 border-b text-left">
                    <button
                      onClick={() => handleEditCliente(cliente)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
            >
              Anterior
            </button>
            <span className="px-4 py-2">{currentPage} de {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-black rounded ml-2"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteList;
