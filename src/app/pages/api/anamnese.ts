import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;

  switch (method) {
    case 'POST':
      try {
        // Faz uma requisição POST para criar uma nova ficha de anamnese
        const response = await axios.post('http://localhost:3001/api/anamnese', body);
        res.status(201).json(response.data);
      } catch (error: any) {
        console.error('Erro ao criar ficha de anamnese:', error);
        res.status(500).json({ error: error.message });
      }
      break;
      
    case 'GET':
      try {
        if (query.clientId) {
          // Busca a ficha de anamnese específica de um cliente
          const response = await axios.get(`http://localhost:3001/api/anamnese/${query.clientId}`);
          res.status(200).json(response.data);
        } else {
          // Busca todas as fichas de anamnese
          const response = await axios.get('http://localhost:3001/api/anamnese');
          res.status(200).json(response.data);
        }
      } catch (error: any) {
        console.error('Erro ao buscar ficha(s) de anamnese:', error);
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const clientId = query.clientId;
        if (!clientId) {
          res.status(400).json({ error: 'Client ID é necessário' });
          return;
        }

        // Atualiza a ficha de anamnese de um cliente específico
        const response = await axios.put(`http://localhost:3001/api/anamnese/${clientId}`, body);
        res.status(200).json(response.data);
      } catch (error: any) {
        console.error('Erro ao atualizar ficha de anamnese:', error);
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const clientId = query.clientId;
        if (!clientId) {
          res.status(400).json({ error: 'Client ID é necessário' });
          return;
        }

        // Exclui a ficha de anamnese de um cliente específico
        const response = await axios.delete(`http://localhost:3001/api/anamnese/${clientId}`);
        res.status(200).json(response.data);
      } catch (error: any) {
        console.error('Erro ao excluir ficha de anamnese:', error);
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ error: 'Método não permitido' });
      break;
  }
}
