# Microsserviços - Back End Development and APIs

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)

Coleção de microsserviços desenvolvidos como parte da certificação Back End Development and APIs do freeCodeCamp. Cada diretório deste repositório representa uma aplicação Node.js autônoma, projetada para atender a casos de uso específicos de desenvolvimento backend e manipulação de protocolos de rede HTTP.

---

## Visão Geral dos Microsserviços

| Diretório | Microsserviço | Descrição | Principais Tecnologias |
|---|---|---|---|
| [`boilerplate-project-timestamp`](./boilerplate-project-timestamp) | Timestamp | Conversão e parsing de datas para formatos Unix e UTC | Node.js, Express, CORS |
| [`boilerplate-project-headerparser`](./boilerplate-project-headerparser) | Request Header Parser | Inspeção e extração de metadados do cliente HTTP (IP, idioma e agente) | Node.js, Express, CORS, Dotenv |
| [`boilerplate-project-urlshortener`](./boilerplate-project-urlshortener) | URL Shortener | Encurtamento de URLs com validação de DNS e redirecionamento | Node.js, Express, MongoDB, Mongoose, DNS API |
| [`boilerplate-project-exercisetracker`](./boilerplate-project-exercisetracker) | Exercise Tracker | Gerenciamento de usuários, registro de exercícios e geração de logs com filtros | Node.js, Express, MongoDB, Mongoose |
| [`boilerplate-project-filemetadata`](./boilerplate-project-filemetadata) | File Metadata | Análise de metadados de arquivos enviados via multipart/form-data | Node.js, Express, Multer, CORS |

---

## Detalhamento dos Projetos

### 1. Timestamp Microservice (`boilerplate-project-timestamp`)
Uma API para manipulação e padronização temporal. Recebe datas no formato textual ISO (ou strings legíveis por `Date`) ou no formato Unix timestamp em milissegundos, retornando uma representação JSON consistente contendo a contagem unix e a string no padrão UTC. Caso nenhuma data seja enviada, o serviço responde com a data e hora atuais do servidor.
- **Rota principal**: `GET /api/:date?`
- **Link**: [Documentação detalhada](./boilerplate-project-timestamp/README.md)

### 2. Request Header Parser Microservice (`boilerplate-project-headerparser`)
Serviço voltado para a extração de dados do cabeçalho da requisição HTTP. Identifica o endereço IP de origem da requisição, a preferência de linguagem configurada no navegador e a identificação do sistema operacional/navegador do cliente através do cabeçalho `User-Agent`.
- **Rota principal**: `GET /api/whoami`
- **Link**: [Documentação detalhada](./boilerplate-project-headerparser/README.md)

### 3. URL Shortener Microservice (`boilerplate-project-urlshortener`)
Serviço de encurtamento e redirecionamento de links web. Ao receber uma URL via POST, o sistema valida a integridade do formato e faz uma consulta DNS ativa (`dns.lookup`) para garantir que o domínio realmente existe na web antes de gerar o identificador numérico correspondente. Os dados são persistidos no MongoDB via Mongoose. Requisições subsequentes ao endpoint encurtado redirecionam o cliente para a URL original com status HTTP 302.
- **Rotas principais**: `POST /api/shorturl` e `GET /api/shorturl/:shorturl`
- **Link**: [Documentação detalhada](./boilerplate-project-urlshortener/README.md)

### 4. Exercise Tracker Microservice (`boilerplate-project-exercisetracker`)
API REST completa para acompanhamento de atividades físicas. Permite cadastrar usuários, associar novos exercícios a um usuário por ID (com descrição, duração em minutos e data) e consultar o histórico de exercícios com suporte a paginação e filtros por intervalo de datas (`from`, `to`) e limite de resultados (`limit`). Modelagem de dados baseada em esquemas Mongoose para usuários e exercícios relacionados.
- **Rotas principais**: `POST /api/users`, `GET /api/users`, `POST /api/users/:_id/exercises` e `GET /api/users/:_id/logs`
- **Link**: [Documentação detalhada](./boilerplate-project-exercisetracker/README.md)

### 5. File Metadata Microservice (`boilerplate-project-filemetadata`)
Microsserviço utilitário para recepção de uploads de arquivos. Utiliza a biblioteca Multer configurada com armazenamento em memória (`memoryStorage`) para processar o payload de formulários multipart (`multipart/form-data`) sem necessidade de escrita persistente em disco. Devolve imediatamente o nome original do arquivo, o tipo MIME e o tamanho em bytes.
- **Rota principal**: `POST /api/fileanalyse`
- **Link**: [Documentação detalhada](./boilerplate-project-filemetadata/README.md)

---

## Estrutura do Repositório

```text
microservices/
├── boilerplate-project-exercisetracker/
│   ├── index.js
│   ├── package.json
│   ├── views/
│   └── README.md
├── boilerplate-project-filemetadata/
│   ├── index.js
│   ├── package.json
│   ├── views/
│   └── README.md
├── boilerplate-project-headerparser/
│   ├── index.js
│   ├── package.json
│   ├── views/
│   └── README.md
├── boilerplate-project-timestamp/
│   ├── index.js
│   ├── package.json
│   ├── views/
│   └── README.md
├── boilerplate-project-urlshortener/
│   ├── index.js
│   ├── package.json
│   ├── views/
│   └── README.md
└── README.md
```

---

## Pré-requisitos

Para executar qualquer um dos microsserviços localmente, é necessário ter instalado na máquina:
- **Node.js** (versão 14.x ou superior recomendada)
- **npm** (gerenciador de pacotes do Node)
- **MongoDB** (instância local em execução ou string de conexão do MongoDB Atlas para os projetos `boilerplate-project-urlshortener` e `boilerplate-project-exercisetracker`)

---

## Como Executar Localmente

Como cada projeto é independente e possui seu próprio `package.json`, o processo de inicialização é feito na pasta correspondente ao serviço desejado.

1. Acesse o diretório do microsserviço que deseja rodar:
   ```bash
   cd boilerplate-project-timestamp
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Se o serviço exigir conexão com banco de dados ou variáveis de ambiente, crie um arquivo `.env` no diretório do projeto:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<banco>?retryWrites=true&w=majority
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. O serviço estará acessível no endereço padrão:
   ```text
   http://localhost:3000
   ```

Para alternar entre projetos ou rodar múltiplos em paralelo, certifique-se de configurar portas diferentes na variável `PORT` de cada serviço.
