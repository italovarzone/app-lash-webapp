'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Hook de roteamento e busca de parâmetros de URL
import { FaSearch } from 'react-icons/fa'; // Ícone de lupa
import Snackbar from '@mui/material/Snackbar'; // Importa o Snackbar do Material-UI
import Alert from '@mui/material/Alert'; // Importa o Alert do Material-UI
import Collapse from '@mui/material/Collapse'; // Importa o Collapse para transição

import { Cliente } from '../models/Cliente'; // Importa o modelo Cliente

type ProcedimentoFavorito = "" | "Efeito Fox" | "Efeito Sirena" | "Brasileiro" | "Russo" | "Classico" | "Lash Lifting";

type ClienteFormData = Omit<Cliente, 'procedimentoFavorito'> & {
  procedimentoFavorito: ProcedimentoFavorito; // Permite "" como valor inicial
};

const ClienteForm: React.FC = () => {
  const router = useRouter(); // Hook de roteamento para redirecionamento
  const searchParams = useSearchParams(); // Hook para pegar parâmetros da URL
  const clienteParam = searchParams.get('cliente'); // Pega o cliente da URL

  const [formData, setFormData] = useState<ClienteFormData>({
    id: undefined, // Adiciona ID como opcional
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
    numero: '',
    complemento: '',
    procedimentoFavorito: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false); // Estado para verificar se está editando
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    // Preenche o formulário com os dados do cliente da URL, se disponível
    if (clienteParam) {
      const clienteData: Cliente = JSON.parse(decodeURIComponent(clienteParam));
      setFormData({
        ...clienteData,
        dataNascimento: clienteData.dataNascimento.split('T')[0], // Ajusta o formato da data
      });
      setIsEditing(true); // Define que estamos editando um cliente
    }
  }, [clienteParam]);

  const handleCepSearch = async () => {
    const cep = formData.cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData({
            ...formData,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          });
        } else {
          setSnackbarMessage('CEP não encontrado.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        setSnackbarMessage('Erro ao buscar o CEP.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage('Por favor, insira um CEP válido com 8 dígitos.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const url = isEditing && formData.id ? `http://localhost:3001/api/clientes/${formData.id}` : 'http://localhost:3001/api/clientes';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSnackbarMessage(isEditing ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setFormData({ // Limpa o formulário após o sucesso
          id: undefined,
          nome: '',
          email: '',
          telefone: '',
          dataNascimento: '',
          cep: '',
          logradouro: '',
          bairro: '',
          cidade: '',
          uf: '',
          numero: '',
          complemento: '',
          procedimentoFavorito: '',
        });

        setTimeout(() => {
          router.push('/listagem');
        }, 2000);
      } else {
        setSnackbarMessage('Erro ao salvar cliente.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setSnackbarMessage('Erro ao salvar cliente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Campos de formulário */}
      <div className="col-span-3">
        <label className="block text-gray-700">Nome do Cliente</label>
        <input type="text" name="nome" placeholder="Nome completo" onChange={handleChange} value={formData.nome} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div className="col-span-3 md:col-span-2">
        <label className="block text-gray-700">Email</label>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="block text-gray-700">Telefone</label>
        <input type="text" name="telefone" placeholder="Telefone" onChange={handleChange} value={formData.telefone} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div className="col-span-3 md:col-span-2">
        <label className="block text-gray-700">Data de Nascimento</label>
        <input type="date" name="dataNascimento" onChange={handleChange} value={formData.dataNascimento} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div className="col-span-3 md:col-span-1 flex items-end">
        <div className="flex flex-grow">
          <input type="text" name="cep" placeholder="CEP" onChange={handleChange} value={formData.cep} className="w-full px-4 py-2 border rounded-l-md" />
          <button type="button" onClick={handleCepSearch} className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-500 transition duration-200">
            <FaSearch />
          </button>
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Logradouro</label>
        <input type="text" name="logradouro" placeholder="Logradouro" onChange={handleChange} value={formData.logradouro} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-gray-700">Bairro</label>
        <input type="text" name="bairro" placeholder="Bairro" onChange={handleChange} value={formData.bairro} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-gray-700">Cidade</label>
        <input type="text" name="cidade" placeholder="Cidade" onChange={handleChange} value={formData.cidade} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-gray-700">UF</label>
        <input type="text" name="uf" placeholder="UF" onChange={handleChange} value={formData.uf} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-gray-700">Número</label>
        <input type="text" name="numero" placeholder="Número" onChange={handleChange} value={formData.numero} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-gray-700">Complemento</label>
        <input type="text" name="complemento" placeholder="Complemento" onChange={handleChange} value={formData.complemento} className="w-full px-4 py-2 border rounded-md" />
      </div>
      <div className="col-span-3">
        <label className="block text-gray-700">Procedimento Favorito</label>
        <select name="procedimentoFavorito" onChange={handleChange} value={formData.procedimentoFavorito} className="w-full px-4 py-2 border rounded-md">
          <option value="">Selecione o Procedimento Favorito</option>
          <option value="Efeito Fox">Efeito Fox</option>
          <option value="Efeito Sirena">Efeito Sirena</option>
          <option value="Brasileiro">Brasileiro</option>
          <option value="Russo">Russo</option>
          <option value="Classico">Clássico</option>
          <option value="Lash Lifting">Lash Lifting</option>
        </select>
      </div>
      <div className="col-span-3">
      <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-200"
          disabled={loading}
        >
          {formData.id !== undefined && formData.id !== 0 ? 'Salvar Cliente' : 'Cadastrar Cliente'}
        </button>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        TransitionComponent={Collapse}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default ClienteForm;
