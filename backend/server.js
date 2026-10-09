const express = require('express');
const cors = require('cors');
const setupSwagger = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());

// Ativa a interface interativa da documentação
setupSwagger(app);

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Verifica o status de operação da API
 *     responses:
 *       200:
 *         description: API operando normalmente.
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});