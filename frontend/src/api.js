import { useState, useEffect } from 'react';
import { testarConexaoBanco, executarTOPSIS } from './api';

function App() {
  const [statusBanco, setStatusBanco] = useState(null);
  const [resultadoTopsis, setResultadoTopsis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    testarConexaoBanco()
      .then((data) => setStatusBanco(data.message))
      .catch((err) => setStatusBanco('Erro ao conectar com o banco: ' + err.message));
  }, []);

  const handleExecutar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await executarTOPSIS();
      setResultadoTopsis(data);
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao executar o TOPSIS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Renewable Energy Platform - TOPSIS</h1>
      
      <div style={{ padding: '1rem', background: '#f0f4f8', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <strong>Status da Base de Dados:</strong> {statusBanco || 'Carregando...'}
      </div>

      <button 
        onClick={handleExecutar} 
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#0066cc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Calculando...' : 'Executar Análise TOPSIS'}
      </button>

      {erro && (
        <div style={{ marginTop: '1rem', color: 'red', padding: '0.75rem', border: '1px solid red', borderRadius: '4px' }}>
          {erro}
        </div>
      )}

      {resultadoTopsis && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Resultados da Execução ({resultadoTopsis.id_run})</h2>
          <p><strong>Status:</strong> {resultadoTopsis.status} | <strong>Passos:</strong> {resultadoTopsis.steps}</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0066cc', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Posição</th>
                <th style={{ padding: '0.5rem' }}>ID Alternativa</th>
                <th style={{ padding: '0.5rem' }}>Nome</th>
                <th style={{ padding: '0.5rem' }}>Score</th>
                <th style={{ padding: '0.5rem' }}>Deliveres</th>
              </tr>
            </thead>
            <tbody>
              {resultadoTopsis.resultados.map((item) => (
                <tr key={item.id_alternativa} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>#{item.posicao_ranking}</td>
                  <td style={{ padding: '0.5rem' }}>{item.id_alternativa}</td>
                  <td style={{ padding: '0.5rem' }}>{item.nome}</td>
                  <td style={{ padding: '0.5rem' }}>{item.score}</td>
                  <td style={{ padding: '0.5rem' }}>{item.deliveres}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;