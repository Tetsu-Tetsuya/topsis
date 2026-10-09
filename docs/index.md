# Manual do Usuário - Plataforma de Energias Renováveis (Método TOPSIS)

Este manual orienta a instalação, configuração, execução e utilização da **Planta de Decisão Multicritério com Algoritmo TOPSIS** para avaliação e ranking de projetos de energias renováveis.

---

## 1. Visão Geral da Aplicação

A plataforma é uma aplicação *full-stack* containerizada que permite avaliar alternativas energéticas (como energia Solar, Eólica e Biomassa) com base em critérios de escolha com pesos configuráveis (como Custo, Eficiência e Impacto Ambiental).

### Arquitetura do Sistema
* **Frontend:** React + Vite (Porta `5173`)
* **Backend:** Node.js + Express (Porta `3001`)
* **Banco de Dados:** PostgreSQL 15 (Porta `5432`)
* **Documentação de API:** Swagger UI (`/api-docs`)
* **Orquestração:** Docker & Docker Compose

---

## 2. Pré-requisitos do Sistema

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (com suporte a Docker Compose)
* [Git](https://git-scm.com/) (para clonagem do repositório)
* Navegador web moderno (Google Chrome, Mozilla Firefox, Edge ou Safari)

---

## 3. Instruções de Instalação e Execução

### Passo 1: Clonar o Repositório
Abra o terminal e execute:

    git clone <URL_DO_REPOSITORIO>
    cd topsis

### Passo 2: Inicializar o Ambiente Docker
Para compilar as imagens e subir todos os serviços (Banco, Backend e Frontend) em um único comando:

    docker compose up --build

> **Nota para redefinição do banco de dados:** Caso precise reiniciar os dados e reexecutar os scripts de inicialização do PostgreSQL, execute:
>
>     docker compose down -v
>     docker compose up --build

## 4. Como Utilizar a Plataforma

### 4.1. Acessando a Interface Web (Dashboard)
1. Abra o navegador e acesse: **`http://localhost:5173`**
2. O Dashboard carregará e verificará automaticamente o **Status da Base de Dados**.

### 4.2. Executando a Análise TOPSIS
1. Na tela principal, clique no botão **`Executar Análise TOPSIS`**.
2. O sistema consultará as alternativas e critérios cadastrados no banco de dados e executará as 5 etapas do algoritmo TOPSIS:
   * Normalização Vetorial da Matriz de Decisão;
   * Ponderação pelos Pesos dos Critérios;
   * Determinação das Soluções Ideais Positiva ($A^+$) e Negativa ($A^-$);
   * Cálculo das Distâncias Euclidianas;
   * Cálculo do Score de Proximidade Relativa ($C_i^*$).
3. Os resultados serão salvos no banco de dados e exibidos imediatamente na tabela de classificação.

### 4.3. Interpretando a Tabela de Resultados

| Coluna | Descrição |
| :--- | :--- |
| **Posição** | Ranking final da alternativa (1º lugar é a opção ideal). |
| **ID Alternativa** | Identificador único da alternativa na base de dados. |
| **Nome** | Nome da fonte/tecnologia energética avaliada. |
| **Score** | Índice de proximidade relativa (entre `0.0000` e `1.0000`). Quanto mais próximo de 1, melhor. |
| **Deliveres** | Número total de alternativas processadas nesta execução (*RUN*). |

---

## 5. Documentação e Testes da API

### 5.1. Swagger UI (Documentação Interativa)
Você pode testar as rotas da API REST diretamente pelo navegador sem a interface React:
* **Endereço:** **`http://localhost:3001/api-docs`**

#### Endpoints Principais:
* `GET /api/test-db` — Verifica a saúde e a conectividade do banco de dados.
* `POST /api/topsis/executar` — Dispara a execução do algoritmo TOPSIS e grava a `RUN` e os resultados no banco.

### 5.2. Executando os Testes Automatizados (Backend)
Para executar a suíte de testes unitários do algoritmo TOPSIS com Jest:

1. Abra o terminal na pasta `backend/`:

    cd backend
    npm test

2. O resultado confirmará os cálculos matemáticos e ordenações do ranking.

---

## 6. Solução de Problemas Comuns (Troubleshooting)

* **Erro `relation "tb_criterio" does not exist` ou `relation "criteria" does not exist`**:
  * **Causa:** O volume do PostgreSQL mantinha dados de uma versão antiga do schema.
  * **Solução:** Pare os containers e limpe o volume executando `docker compose down -v` e depois suba com `docker compose up --build`.

* **Erro de Conexão no Frontend (`Network Error`)**:
  * **Causa:** O container do backend ainda está inicializando ou aguardando o banco.
  * **Solução:** Aguarde a mensagem `Servidor Backend a rodar na porta 3001` nos logs do terminal e recarregue a página.