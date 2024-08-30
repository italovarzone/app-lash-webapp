'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa'; // Ícone de lupa
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import InputMask from 'react-input-mask';

import { Cliente } from '../models/Cliente';

type ProcedimentoFavorito = "" | "Efeito Fox" | "Efeito Sirena" | "Brasileiro" | "Russo" | "Classico" | "Lash Lifting";

type ClienteFormData = Omit<Cliente, 'procedimentoFavorito'> & {
  procedimentoFavorito: ProcedimentoFavorito; // Permite "" como valor inicial
};

const ClienteForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteParam = searchParams.get('cliente');

  const [formData, setFormData] = useState<ClienteFormData>({
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

  const [errors, setErrors] = useState<{ [key in keyof ClienteFormData]?: string }>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (clienteParam) {
      const clienteData: Cliente = JSON.parse(decodeURIComponent(clienteParam));
      setFormData({
        ...clienteData,
        dataNascimento: clienteData.dataNascimento.split('T')[0], // Ajusta o formato da data
      });
      setIsEditing(true);
    }
  }, [clienteParam]);

  const validateForm = (): boolean => {
    const newErrors: { [key in keyof ClienteFormData]?: string } = {};

    // Validações de campo obrigatório
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de Nascimento é obrigatória';
    if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = 'CEP inválido';
    if (!formData.logradouro) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.uf || formData.uf.length !== 2) newErrors.uf = 'UF inválido';
    if (!formData.numero) newErrors.numero = 'Número é obrigatório';
    if (!formData.procedimentoFavorito) newErrors.procedimentoFavorito = 'Procedimento Favorito é obrigatório';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCepSearch = async () => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Remove a mensagem de erro assim que o usuário começar a digitar
    if (errors[name as keyof ClienteFormData]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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
        setFormData({
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
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          onChange={handleChange}
          value={formData.nome}
          className={`w-full px-4 py-2 border rounded-md ${errors.nome ? 'border-red-500' : ''}`}
        />
        {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className={`w-full px-4 py-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="block text-gray-700">Telefone</label>
        <InputMask
          mask="(99) 99999-9999"
          type="text"
          name="telefone"
          placeholder="Telefone"
          onChange={handleChange}
          value={formData.telefone}
          className={`w-full px-4 py-2 border rounded-md ${errors.telefone ? 'border-red-500' : ''}`}
        />
        {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone}</p>}
      </div>
      <div className="col-span-3 md:col-span-1">
        <label className="block text-gray-700">Data de Nascimento</label>
        <input
          type="date"
          name="dataNascimento"
          onChange={handleChange}
          value={formData.dataNascimento}
          className={`w-full px-4 py-2 border rounded-md ${errors.dataNascimento ? 'border-red-500' : ''}`}
        />
        {errors.dataNascimento && <p className="text-red-500 text-sm">{errors.dataNascimento}</p>}
      </div>
      <div className="mt-auto">
      <label className="block text-gray-700">CEP</label>
        <div className="flex flex-grow">
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            onChange={handleChange}
            value={formData.cep}
            className={`w-full px-4 py-2 border rounded-l-md ${errors.cep ? 'border-red-500' : ''}`}
          />
          <button type="button" onClick={handleCepSearch} className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-500 transition duration-200">
            <FaSearch />
          </button>
        </div>
        {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>} {/* Mensagem de erro do CEP */}
      </div>
      <div>
        <label className="block text-gray-700">Logradouro</label>
        <input
          type="text"
          name="logradouro"
          placeholder="Logradouro"
          onChange={handleChange}
          value={formData.logradouro}
          className={`w-full px-4 py-2 border rounded-md ${errors.logradouro ? 'border-red-500' : ''}`}
        />
        {errors.logradouro && <p className="text-red-500 text-sm">{errors.logradouro}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Bairro</label>
        <input
          type="text"
          name="bairro"
          placeholder="Bairro"
          onChange={handleChange}
          value={formData.bairro}
          className={`w-full px-4 py-2 border rounded-md ${errors.bairro ? 'border-red-500' : ''}`}
        />
        {errors.bairro && <p className="text-red-500 text-sm">{errors.bairro}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Cidade</label>
        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          onChange={handleChange}
          value={formData.cidade}
          className={`w-full px-4 py-2 border rounded-md ${errors.cidade ? 'border-red-500' : ''}`}
        />
        {errors.cidade && <p className="text-red-500 text-sm">{errors.cidade}</p>}
      </div>
      <div>
        <label className="block text-gray-700">UF</label>
        <input
          type="text"
          name="uf"
          placeholder="UF"
          onChange={handleChange}
          value={formData.uf}
          className={`w-full px-4 py-2 border rounded-md ${errors.uf ? 'border-red-500' : ''}`}
        />
        {errors.uf && <p className="text-red-500 text-sm">{errors.uf}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Número</label>
        <input
          type="text"
          name="numero"
          placeholder="Número"
          onChange={handleChange}
          value={formData.numero}
          className={`w-full px-4 py-2 border rounded-md ${errors.numero ? 'border-red-500' : ''}`}
        />
        {errors.numero && <p className="text-red-500 text-sm">{errors.numero}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Complemento</label>
        <input
          type="text"
          name="complemento"
          placeholder="Complemento"
          onChange={handleChange}
          value={formData.complemento}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-gray-700">Procedimento Favorito</label>
        <select
          name="procedimentoFavorito"
          onChange={handleChange}
          value={formData.procedimentoFavorito}
          className={`w-full px-4 py-2 border rounded-md ${errors.procedimentoFavorito ? 'border-red-500' : ''}`}
        >
          <option value="">Selecione o Procedimento Favorito</option>
          <option value="Efeito Fox">Efeito Fox</option>
          <option value="Efeito Sirena">Efeito Sirena</option>
          <option value="Brasileiro">Brasileiro</option>
          <option value="Russo">Russo</option>
          <option value="Classico">Clássico</option>
          <option value="Lash Lifting">Lash Lifting</option>
        </select>
        {errors.procedimentoFavorito && <p className="text-red-500 text-sm">{errors.procedimentoFavorito}</p>}
      </div>
      <div className="col-span-3">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-200"
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
