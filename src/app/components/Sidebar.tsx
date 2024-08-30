'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true); // Estado para abrir/fechar sidebar
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false); // Estado para o diálogo de logout

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  const handleNavigation = (content: 'clientes' | 'listagem') => {
    if (content === 'clientes') {
      router.push('/cadastro');
    } else if (content === 'listagem') {
      router.push('/listagem');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Alterna entre aberto/fechado
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true); // Abre o diálogo de logout
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false); // Fecha o diálogo de logout
  };

  return (
    <div className={`flex ${isOpen ? 'w-64' : 'w-20'} bg-indigo-300 text-white h-screen transition-width duration-300 ease-in-out`}>
      <aside className={`flex flex-col justify-between h-full ${isOpen ? 'p-4' : 'p-2.5'}`}>
        {/* Botão de Toggle */}
        <div className="flex justify-center items-center gap-4">
          {isOpen && <h2 className="text-xl font-bold">{username ? `Olá, ${username}` : 'Usuário'}</h2>}
          <Tooltip title="Abrir/Fechar Sidebar">
            <IconButton onClick={toggleSidebar} color="inherit">
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </div>

        {/* Itens da Sidebar */}
        <ul className="mt-8 flex-grow">
          <li>
            <button
              onClick={() => handleNavigation('clientes')}
              className={`flex items-center gap-2 text-white hover:bg-indigo-500 rounded px-4 py-2 w-full text-left ${pathname === '/cadastro' ? 'bg-indigo-600' : ''}`}
            >
              <PersonAddIcon />
              {isOpen && 'Cadastro de Clientes'}
            </button>
          </li>
          <li className="mt-2">
            <button
              onClick={() => handleNavigation('listagem')}
              className={`flex items-center gap-2 text-white hover:bg-indigo-500 rounded px-4 py-2 w-full text-left ${pathname === '/listagem' ? 'bg-indigo-600' : ''}`}
            >
              <ListAltIcon />
              {isOpen && 'Listagem de Clientes'}
            </button>
          </li>
        </ul>

        {/* Botão de Logout */}
        <div className="mt-4">
          <button
            onClick={openLogoutDialog}
            className="flex items-center gap-2 text-white hover:bg-red-500 rounded px-4 py-2 w-full text-left bg-red-600"
          >
            <LogoutIcon />
            {isOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Dialog de Confirmação de Logout */}
      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
      >
        <DialogTitle>Confirmar Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja sair da sua conta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
