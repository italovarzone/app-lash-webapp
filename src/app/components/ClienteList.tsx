import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Cliente } from '../models/Cliente';
import {
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClienteList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [resultsLimit, setResultsLimit] = useState<number>(10);
  const router = useRouter();

  useEffect(() => {
    fetchClientes(currentPage);
  }, [currentPage, resultsLimit]);

  const fetchClientes = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/clientes?page=${page}&limit=${resultsLimit}`);
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        setClientes(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('Formato de resposta inesperado:', data);
        setClientes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setSnackbarMessage('Erro ao buscar clientes.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const searchClientesByName = useCallback(async (nome: string) => {
    if (nome.trim() === '') {
      fetchClientes(currentPage);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/clientes/search?nome=${nome}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setClientes(data);
      } else {
        console.error('Formato de resposta inesperado:', data);
        setClientes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setSnackbarMessage('Erro ao buscar clientes.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleEditCliente = (cliente: Cliente) => {
    router.push(`/cadastro?cliente=${encodeURIComponent(JSON.stringify(cliente))}`);
  };

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (clienteToDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/clientes/${clienteToDelete.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setSnackbarMessage('Cliente excluído com sucesso!');
          setSnackbarSeverity('success');
          setClientes(clientes.filter((cliente) => cliente.id !== clienteToDelete.id));
        } else {
          setSnackbarMessage('Erro ao excluir cliente.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        setSnackbarMessage('Erro ao excluir cliente.');
        setSnackbarSeverity('error');
      } finally {
        setOpenDeleteDialog(false);
        setClienteToDelete(null);
        setSnackbarOpen(true);
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setClienteToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    searchClientesByName(e.target.value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setResultsLimit(Number(event.target.value));
    setCurrentPage(1); // Resetar para a primeira página ao mudar o limite
  };

  return (
    <div className="relative p-2 flex flex-col">
        <div>
          <label className="block text-gray-700 pb-2">Filtros</label>
          <input
            type="text"
            name="complemento"
            placeholder="Digite o nome do cliente..."
            onChange={handleSearchChange}
            value={searchTerm}
            className="w-full px-4 py-2 border rounded-md mb-12"
          />
        </div>
      {/* Input de busca */}
      {/* <TextField
        label="Buscar por nome"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      /> */}

      {/* Contêiner da tabela com rolagem e altura máxima */}
      <div className="flex-grow overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
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
            {loading ? (
              <tr>
                <td colSpan={4} className="py-6 text-center">
                  <CircularProgress color="primary" />
                </td>
              </tr>
            ) : clientes.length <= 0 ? (
              <tr>
                <td colSpan={4} className="py-3 px-4 text-center text-gray-600">Nenhum cliente encontrado na base.</td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-4 border-b text-left">{cliente.nome}</td>
                  <td className="px-4 border-b text-left">{new Date(cliente.dataNascimento).toLocaleDateString()}</td>
                  <td className="px-4 border-b text-left">{cliente.telefone}</td>
                  <td className="px-4 border-b text-left">
                    <IconButton
                      onClick={() => handleEditCliente(cliente)}
                      aria-label="edit"
                      className="text-primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(cliente)}
                      aria-label="delete"
                    >
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
              {/* Rodapé fixo para Paginação e Seleção de Limite */}
      <div className="fixed bottom-0 left-70 bg-white shadow-md p-4 flex justify-center items-center z-10">
        <div className="flex justify-between gap-32">
          <div className="flex gap-16">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="contained"
              className="bg-primary mr-2 hover:bg-primary"
            >
              Anterior
            </Button>
            <span className="px-4 py-2">{currentPage} de {totalPages}</span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="contained"
              className="bg-primary ml2 hover:bg-primary"
            >
              Próxima
            </Button>
          </div>
          <FormControl variant="outlined" size="small">
            <InputLabel className="w-100" id="select-limit-label">Resultados</InputLabel>
            <Select
              labelId="select-limit-label"
              value={resultsLimit}
              onChange={handleLimitChange}
              label="Resultados"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar Exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o cliente <strong>{clienteToDelete?.nome}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="contained" color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="secondary" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClienteList;
