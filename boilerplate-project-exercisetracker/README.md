# Exercise Tracker Microservice

Microsserviço de gerenciamento de atividades físicas desenvolvido para a certificação Back End Development and APIs do freeCodeCamp. O sistema implementa uma API REST que permite criar contas de usuários, registrar treinos associados a cada conta e extrair relatórios históricos estruturados com filtros dinâmicos de período e limitação de registros.

---

## Tecnologias e Dependências

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express (v4.x)**: Framework web utilizado para definição das rotas da API e middlewares.
- **MongoDB**: Banco de dados orientado a documentos utilizado para armazenar os dados de usuários e treinos.
- **Mongoose (v5.x)**: ODM para modelagem, validação de tipos e relacionamento entre documentos no MongoDB.
- **CORS**: Habilitação de requisições Cross-Origin.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

---

## Modelagem dos Dados (Schemas Mongoose)

A persistência é estruturada através de dois esquemas principais com relacionamento referencial:

### 1. Schema de Usuário (`User`)
```javascript
{
  username: { type: String, required: true }
}
```

### 2. Schema de Exercício (`Exercise`)
```javascript
{
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}
```

---

## Endpoints da API

### 1. Página Inicial
- **Método**: `GET`
- **Rota**: `/`
- **Descrição**: Entrega a interface web estática (`views/index.html`) para interação manual com o serviço.

### 2. Criar Novo Usuário
- **Método**: `POST`
- **Rota**: `/api/users`
- **Headers**: `Content-Type: application/x-www-form-urlencoded`
- **Body**:
  - `username` (string, obrigatório): Nome de identificação do usuário.

#### Resposta de Sucesso:
- **Status**: `200 OK`
- **Retorno**:
  ```json
  {
    "_id": "64d0e123456789abcdef0123",
    "username": "usuario_treino"
  }
  ```

### 3. Listar Todos os Usuários
- **Método**: `GET`
- **Rota**: `/api/users`
- **Descrição**: Retorna uma lista de todos os usuários cadastrados na base de dados com seus respectivos identificadores.

#### Resposta de Sucesso:
- **Status**: `200 OK`
- **Retorno**:
  ```json
  [
    {
      "_id": "64d0e123456789abcdef0123",
      "username": "usuario_treino"
    },
    {
      "_id": "64d0e987654321fedcba3210",
      "username": "segundo_usuario"
    }
  ]
  ```

### 4. Adicionar Exercício para um Usuário
- **Método**: `POST`
- **Rota**: `/api/users/:_id/exercises`
- **Parâmetros de Rota**:
  - `_id`: Identificador MongoDB do usuário.
- **Headers**: `Content-Type: application/x-www-form-urlencoded`
- **Body**:
  - `description` (string, obrigatório): Descrição da atividade física.
  - `duration` (número, obrigatório): Duração do exercício em minutos.
  - `date` (string `YYYY-MM-DD`, opcional): Data da realização. Caso seja omitida, o sistema adota a data atual.

#### Resposta de Sucesso:
- **Status**: `200 OK`
- **Retorno**:
  ```json
  {
    "_id": "64d0e123456789abcdef0123",
    "username": "usuario_treino",
    "description": "Corrida 5km",
    "duration": 30,
    "date": "Mon Jan 01 1990"
  }
  ```
  *(Nota: A data é retornada formatada como uma string gerada pelo método nativo `.toDateString()`)*

### 5. Consultar Histórico de Exercícios (Logs)
- **Método**: `GET`
- **Rota**: `/api/users/:_id/logs`
- **Parâmetros de Rota**:
  - `_id`: Identificador MongoDB do usuário.
- **Query Parameters Opcionais**:
  - `from` (`YYYY-MM-DD`): Filtra exercícios a partir desta data (inclusiva).
  - `to` (`YYYY-MM-DD`): Filtra exercícios até esta data (inclusiva).
  - `limit` (inteiro): Limita a quantidade máxima de itens retornados no array de logs.

#### Resposta de Sucesso:
- **Status**: `200 OK`
- **Exemplo de Retorno com Filtros (`/api/users/64d0e123456789abcdef0123/logs?from=2023-01-01&limit=2`):**
  ```json
  {
    "_id": "64d0e123456789abcdef0123",
    "username": "usuario_treino",
    "count": 2,
    "log": [
      {
        "description": "Corrida 5km",
        "duration": 30,
        "date": "Mon Jan 02 2023"
      },
      {
        "description": "Natação",
        "duration": 45,
        "date": "Wed Jan 04 2023"
      }
    ]
  }
  ```

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do diretório deste microsserviço:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome-do-banco>?retryWrites=true&w=majority
```

---

## Instalação e Execução

### 1. Acessar o diretório
```bash
cd boilerplate-project-exercisetracker
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o microsserviço
```bash
npm start
```

O servidor estará escutando na porta indicada em `PORT` (padrão 3000).

---

## Exemplos de Uso com cURL

```bash
# 1. Cadastrar usuário
curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=atleta1"

# 2. Listar usuários
curl http://localhost:3000/api/users

# 3. Adicionar exercício para o usuário (substitua pelo ID retornado no passo 1)
curl -X POST http://localhost:3000/api/users/64d0e123456789abcdef0123/exercises \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "description=Musculação&duration=60&date=2023-05-10"

# 4. Obter histórico completo
curl http://localhost:3000/api/users/64d0e123456789abcdef0123/logs

# 5. Obter histórico com intervalo de datas e limite de registros
curl "http://localhost:3000/api/users/64d0e123456789abcdef0123/logs?from=2023-01-01&to=2023-12-31&limit=5"
```
