// backend/db.js
import pkg from 'pg';
const { Pool } = pkg;

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',          // O seu utilizador do PostgreSQL
  host: 'localhost',
  database: 'topsis_db',      // A base de dados que criou no pgAdmin
  password: '1819', 
  port: 5432,
});

export default pool;