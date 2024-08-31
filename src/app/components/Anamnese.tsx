"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircularProgress, Snackbar, Alert, Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const Anamnese: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');

  const [datetime, setDatetime] = useState<string>('');
  const [formValues, setFormValues] = useState({
    rimel: '',
    gestante: '',
    procedimento_olhos: '',
    alergia: '',
    especificar_alergia: '',
    tireoide: '',
    problema_ocular: '',
    especificar_ocular: '',
    oncologico: '',
    dorme_lado: '',
    dorme_lado_posicao: '',
    problema_informar: '',
    procedimento: '',
    mapping: '',
    estilo: '',
    modelo_fios: '',
    espessura: '',
    curvatura: '',
    adesivo: '',
    observacao: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (clientId) {
      fetchAnamneseData();
    }
  }, [clientId]);

  const fetchAnamneseData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/anamnese/${clientId}`);
      const data = await response.json();
      if (response.ok) {
        setDatetime(data.datetime);
        setFormValues({
          rimel: data.rimel || '',
          gestante: data.gestante || '',
          procedimento_olhos: data.procedimento_olhos || '',
          alergia: data.alergia || '',
          especificar_alergia: data.especificar_alergia || '',
          tireoide: data.tireoide || '',
          problema_ocular: data.problema_ocular || '',
          especificar_ocular: data.especificar_ocular || '',
          oncologico: data.oncologico || '',
          dorme_lado: data.dorme_lado || '',
          dorme_lado_posicao: data.dorme_lado_posicao || '',
          problema_informar: data.problema_informar || '',
          procedimento: data.procedimento || '',
          mapping: data.mapping || '',
          estilo: data.estilo || '',
          modelo_fios: data.modelo_fios || '',
          espessura: data.espessura || '',
          curvatura: data.curvatura || '',
          adesivo: data.adesivo || '',
          observacao: data.observacao || '',
        });
      } else {
        console.error('Error fetching anamnese data:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch anamnese data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/api/anamnese${clientId ? `/${clientId}` : ''}`, {
        method: clientId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, datetime, ...formValues }),
      });

      if (response.ok) {
        setSnackbarMessage('Ficha de anamnese salva com sucesso!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Erro ao salvar a ficha de anamnese.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('Erro ao processar a solicitação.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  return (
    <div className="p-4">
      <h1>Ficha de Anamnese</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxHeight: '80vh', overflowY: 'auto' }}>
        {/* Nome do Cliente */}
        <TextField
          label="Nome do Cliente"
          value={clientId}
          fullWidth
          margin="normal"
          disabled
        />

        {/* Data/Hora do Cadastro */}
        <TextField
          label="Data/Hora do Cadastro"
          value={datetime}
          fullWidth
          margin="normal"
          disabled
        />

        {/* Gestante */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Gestante?</FormLabel>
          <RadioGroup row name="gestante" value={formValues.gestante} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        {/* Rimel */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Está de rímel?</FormLabel>
          <RadioGroup row name="rimel" value={formValues.rimel} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        {/* Procedimento Olhos */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Usa lente de contato?</FormLabel>
          <RadioGroup row name="procedimento_olhos" value={formValues.procedimento_olhos} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        {/* Alergia */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Possui alergia a esmaltes/cosméticos/cianoacrilato?</FormLabel>
          <RadioGroup row name="alergia" value={formValues.alergia} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
          {formValues.alergia === 'Sim' && (
            <TextField
              label="Especifique a alergia"
              name="especificar_alergia"
              value={formValues.especificar_alergia}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )}
        </FormControl>

        {/* Tireoide */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Possui problemas com tireoide?</FormLabel>
          <RadioGroup row name="tireoide" value={formValues.tireoide} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        {/* Problema Ocular */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Possui glaucoma/blefarite/algum problema ocular?</FormLabel>
          <RadioGroup row name="problema_ocular" value={formValues.problema_ocular} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
          {formValues.problema_ocular === 'Sim' && (
            <TextField
              label="Especifique o problema ocular"
              name="especificar_ocular"
              value={formValues.especificar_ocular}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          )}
        </FormControl>

        {/* Oncologico */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Está em tratamento oncológico?</FormLabel>
          <RadioGroup row name="oncologico" value={formValues.oncologico} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        {/* Dorme de lado */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Dorme de lado?</FormLabel>
          <RadioGroup row name="dorme_lado" value={formValues.dorme_lado} onChange={handleChange}>
            <FormControlLabel value="Sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="Não" control={<Radio />} label="Não" />
          </RadioGroup>
          {formValues.dorme_lado === 'Sim' && (
            <FormControl component="fieldset" margin="normal" style={{ marginTop: '8px' }}>
              <FormLabel component="legend">De que lado?</FormLabel>
              <RadioGroup row name="dorme_lado_posicao" value={formValues.dorme_lado_posicao} onChange={handleChange}>
                <FormControlLabel value="Esquerdo" control={<Radio />} label="Esquerdo" />
                <FormControlLabel value="Direito" control={<Radio />} label="Direito" />
              </RadioGroup>
            </FormControl>
          )}
        </FormControl>

        {/* Problema Informar */}
        <TextField
          label="Existe algum problema que julgue pertinente informar ao profissional?"
          name="problema_informar"
          value={formValues.problema_informar}
          onChange={handleChange}
          fullWidth
          margin="normal"
          style={{ gridColumn: 'span 3' }}
        />

        {/* Procedimento de Preferência */}
        <FormControl component="fieldset" margin="normal" style={{ gridColumn: 'span 3' }}>
          <FormLabel component="legend">Procedimento de preferência:</FormLabel>
          <RadioGroup row name="procedimento" value={formValues.procedimento} onChange={handleChange}>
            <FormControlLabel value="Brasileiro" control={<Radio />} label="Brasileiro" />
            <FormControlLabel value="Fox Eyes" control={<Radio />} label="Fox Eyes" />
            <FormControlLabel value="Clássico" control={<Radio />} label="Clássico" />
            <FormControlLabel value="Sirena" control={<Radio />} label="Sirena" />
          </RadioGroup>
        </FormControl>

        {/* Mapping, Estilo, Modelo dos Fios, Espessura, Curvatura, Adesivo, Observação */}
        <TextField
          label="Mapping"
          name="mapping"
          value={formValues.mapping}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Estilo"
          name="estilo"
          value={formValues.estilo}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Modelo dos Fios"
          name="modelo_fios"
          value={formValues.modelo_fios}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Espessura"
          name="espessura"
          value={formValues.espessura}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Curvatura"
          name="curvatura"
          value={formValues.curvatura}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Adesivo/Cola"
          name="adesivo"
          value={formValues.adesivo}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Observação"
          name="observacao"
          value={formValues.observacao}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          style={{ gridColumn: 'span 3' }}
        />

        {/* Botões de Ação */}
        <div style={{ gridColumn: 'span 3', display: 'flex', gap: '16px', marginTop: '16px' }}>
          <Button
            type="submit"
            variant="contained"
            className="bg-indigo-600 text-white"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Ficha Técnica'}
          </Button>
          <Button
            variant="contained"
            className="bg-gray-300 text-white"
            onClick={() => router.push('/listagem')}
          >
            Voltar
          </Button>
        </div>
      </form>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Anamnese;
