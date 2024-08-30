export interface Cliente {
    id: number | undefined;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
    numero: string;
    complemento?: string;
    procedimentoFavorito: 'Efeito Fox' | 'Efeito Sirena' | 'Brasileiro' | 'Russo' | 'Classico' | 'Lash Lifting'; // Enum
  }
  