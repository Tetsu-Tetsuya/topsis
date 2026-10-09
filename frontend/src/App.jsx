import React, { useState } from 'react';

export default function App() {
  const [execucao, setExecucao] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const executarTopsis = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await fetch('http://localhost:3001/api/topsis/executar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao processar');

      setExecucao(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  const exportarCSV = () => {
    if (!execucao || !execucao.resultados) return;

    const headers = ["Id da RUN", "Score", "Deliveres", "steps", "seed", "status"];
    
    const rows = execucao.resultados.map(res => [
      execucao.id_run,
      res.score,
      res.deliveres,
      execucao.steps,
      execucao.seed,
      execucao.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `execucao_${execucao.id_run}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      {/* Cabeçalho Limpo */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#1a202c', marginBottom: '8px' }}>
          Plataforma de Energias Renováveis
        </h1>
        <h2 style={{ fontSize: '20px', color: '#4a5568', fontWeight: 'normal' }}>
          Método TOPSIS
        </h2>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
      </div>

      {/* Ação Principal */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <button 
          onClick={executarTopsis} 
          disabled={carregando}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px', 
            fontWeight: 'bold',
            cursor: carregando ? 'not-allowed' : 'pointer', 
            backgroundColor: '#0066cc', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {carregando ? 'A Processar...' : 'Executar Análise TOPSIS'}
        </button>
      </div>

      {/* Erros */}
      {erro && (
        <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#9b2c2c', borderRadius: '6px', marginBottom: '20px' }}>
          <strong>Erro:</strong> {erro}
        </div>
      )}

      {/* Painel de Resultados */}
      {execucao && (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '20px', margin: 0 }}>Resultados da Execução</h3>
              <p style={{ color: '#718096', fontSize: '14px', marginTop: '4px' }}>
                ID RUN: <strong>{execucao.id_run}</strong> | Status: <strong>{execucao.status}</strong> | Seed: <strong>{execucao.seed}</strong> | Steps: <strong>{execucao.steps}</strong>
              </p>
            </div>
            <button 
              onClick={exportarCSV} 
              style={{ 
                padding: '10px 18px', 
                backgroundColor: '#28a745', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Exportar CSV
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>Ranking</th>
                <th style={{ padding: '12px' }}>Alternativa</th>
                <th style={{ padding: '12px' }}>Score (Ci*)</th>
                <th style={{ padding: '12px' }}>Deliveres</th>
              </tr>
            </thead>
            <tbody>
              {execucao.resultados.map((res) => (
                <tr key={res.id_alternativa} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px' }}><strong>{res.posicao_ranking}º</strong></td>
                  <td style={{ padding: '12px' }}>{res.nome}</td>
                  <td>{res.score !== undefined && res.score !== null ? String(res.score) : '0.5000'}</td>
                  <td style={{ padding: '12px' }}>{res.deliveres}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}