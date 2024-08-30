import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const response = await axios.post('http://localhost:3001/register', req.body);
    res.status(200).json(response.data);
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
