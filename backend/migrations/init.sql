-- Criação da tabela de Projetos de Energia Renovável
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Alternativas (ex: Solar, Eólica, Biomassa)
CREATE TABLE IF NOT EXISTS alternatives (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- Criação da tabela de Critérios de Avaliação (ex: Custo, Eficiência, Impacto Ambiental)
CREATE TABLE IF NOT EXISTS criteria (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    weight FLOAT NOT NULL,
    is_benefit BOOLEAN NOT NULL DEFAULT true
);

-- Criação da tabela de Matriz de Decisão (Valores para o cálculo TOPSIS)
CREATE TABLE IF NOT EXISTS evaluation_matrix (
    id SERIAL PRIMARY KEY,
    alternative_id INT REFERENCES alternatives(id) ON DELETE CASCADE,
    criterion_id INT REFERENCES criteria(id) ON DELETE CASCADE,
    value FLOAT NOT NULL
);