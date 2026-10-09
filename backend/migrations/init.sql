-- backend/migrations/init.sql
-- Projetos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alternativas
CREATE TABLE IF NOT EXISTS alternatives (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- Critérios
CREATE TABLE IF NOT EXISTS criteria (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    weight FLOAT NOT NULL,
    is_benefit BOOLEAN NOT NULL DEFAULT true
);

-- Matriz de Avaliação
CREATE TABLE IF NOT EXISTS evaluation_matrix (
    id SERIAL PRIMARY KEY,
    alternative_id INT REFERENCES alternatives(id) ON DELETE CASCADE,
    criterion_id INT REFERENCES criteria(id) ON DELETE CASCADE,
    value FLOAT NOT NULL
);

-- Execuções de RUN do TOPSIS
CREATE TABLE IF NOT EXISTS runs (
    id_run VARCHAR(50) PRIMARY KEY,
    seed INT,
    steps INT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resultados
CREATE TABLE IF NOT EXISTS run_results (
    id SERIAL PRIMARY KEY,
    id_run VARCHAR(50) REFERENCES runs(id_run) ON DELETE CASCADE,
    alternative_id INT REFERENCES alternatives(id) ON DELETE CASCADE,
    score NUMERIC(5, 4),
    deliveres INT,
    ranking_position INT
);

-- Dados Iniciais para Teste
INSERT INTO projects (id, name, description) VALUES (1, 'Projeto Solar vs Eólica', 'Avaliação de matriz energética') ON CONFLICT DO NOTHING;

INSERT INTO alternatives (id, project_id, name) VALUES 
    (1, 1, 'Planta Solar A'),
    (2, 1, 'Parque Eólico B'),
    (3, 1, 'Usina Biomassa C')
ON CONFLICT DO NOTHING;

INSERT INTO criteria (id, project_id, name, weight, is_benefit) VALUES 
    (1, 1, 'Custo', 0.40, false),
    (2, 1, 'Eficiência', 0.35, true),
    (3, 1, 'Impacto Ambiental', 0.25, false)
ON CONFLICT DO NOTHING;