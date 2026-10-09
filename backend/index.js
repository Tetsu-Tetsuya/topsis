// backend/index.js
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { calcularTOPSIS } from './topsisService.js';

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste da conexão com o banco de dados
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'PostgreSQL conectado com sucesso!', time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao conectar ao banco: ' + err.message });
  }
});

// Rota para executar o TOPSIS e guardar a RUN no banco
app.post('/api/topsis/executar', async (req, res) => {
  try {
    const criteriosRes = await pool.query('SELECT * FROM tb_criterio');
    const alternativasRes = await pool.query('SELECT * FROM tb_alternativa');

    if (alternativasRes.rows.length === 0 || criteriosRes.rows.length === 0) {
      return res.status(400).json({ error: 'Insira alternativas e critérios na base de dados antes de executar.' });
    }

    const resultadoTopsis = calcularTOPSIS(
      alternativasRes.rows, 
      criteriosRes.rows, 
      { deliveres: alternativasRes.rows.length }
    );

    // 1. Guardar a RUN
    await pool.query(
      'INSERT INTO tb_execucao_run (id_run, seed, steps, status) VALUES ($1, $2, $3, $4)',
      [resultadoTopsis.id_run, resultadoTopsis.seed, resultadoTopsis.steps, resultadoTopsis.status]
    );

    // 2. Guardar os resultados detalhados
    for (const item of resultadoTopsis.resultados) {
      await pool.query(
        'INSERT INTO tb_resultado_analise (id_run, id_alternativa, score, deliveres, posicao_ranking) VALUES ($1, $2, $3, $4, $5)',
        [resultadoTopsis.id_run, item.id_alternativa, item.score, item.deliveres, item.posicao_ranking]
      );
    }

    // Retorna a estrutura com a propriedade score garantida
    res.json(resultadoTopsis);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar TOPSIS: ' + err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Backend a rodar na porta ${PORT}`);
});