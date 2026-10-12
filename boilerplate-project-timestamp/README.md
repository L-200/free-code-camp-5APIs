# Timestamp Microservice

Microsserviço de conversão e padronização de datas desenvolvido para a trilha Back End Development and APIs do freeCodeCamp. A API recebe entradas temporais em múltiplos formatos e retorna um objeto JSON padronizado com o timestamp Unix (em milissegundos) e a string formatada em UTC.

---

## Tecnologias e Dependências

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express (v4.x)**: Framework web utilizado para roteamento e tratamento de requisições HTTP.
- **CORS**: Middleware configurado para permitir requisições de origens cruzadas.

---

## Regras de Negócio e Tratamento de Dados

A lógica do endpoint principal (`/api/:date?`) opera sob as seguintes condições:

1. **Parâmetro Ausente (`GET /api/` ou `GET /api`)**:
   Quando nenhum parâmetro é enviado na rota, o serviço utiliza a data e hora correntes (`new Date()`).

2. **Entrada Numérica (Unix Timestamp)**:
   Se a string passada contiver apenas dígitos numéricos (validada via regex `/^\d+$/`), o valor é convertido em número e interpretado como milissegundos a partir da época Unix (1 de janeiro de 1970).

3. **Entrada Textual (Data em String)**:
   Se a entrada for uma representação de texto (como `2016-12-25` ou `05 October 2011, GMT`), o JavaScript tenta fazer o parsing com `new Date(date)`. Existe uma validação adicional para garantir que strings no formato `YYYY-MM-DD` correspondam exatamente ao dia instanciado, prevenindo problemas com fuso horário e datas inexistentes.

4. **Entrada Inválida**:
   Se a entrada resultar em uma data inválida (`isNaN(parsed.getTime())`), a resposta será um objeto com a chave de erro: `{"error": "Invalid Date"}`.

---

## Endpoints

### 1. Página Inicial
- **Método**: `GET`
- **Rota**: `/`
- **Descrição**: Entrega a interface estática HTML para demonstração e interação com a API.

### 2. Endpoint de Boas-Vindas
- **Método**: `GET`
- **Rota**: `/api/hello`
- **Resposta**:
  ```json
  {
    "greeting": "hello API"
  }
  ```

### 3. Processamento de Data
- **Método**: `GET`
- **Rota**: `/api/:date?`
- **Parâmetros de Rota**:
  - `date` *(opcional)*: Data em formato de texto (`YYYY-MM-DD`, `RFC2822`, etc.) ou Unix timestamp numérico em milissegundos.

#### Respostas:

**Sucesso (com data válida ou parâmetro vazio):**
- **Status**: `200 OK`
- **Exemplo com data textual (`/api/2016-12-25`):**
  ```json
  {
    "unix": 1482624000000,
    "utc": "Sun, 25 Dec 2016 00:00:00 GMT"
  }
  ```
- **Exemplo com timestamp Unix (`/api/1451606400000`):**
  ```json
  {
    "unix": 1451606400000,
    "utc": "Fri, 01 Jan 2016 00:00:00 GMT"
  }
  ```

**Erro (data não reconhecida):**
- **Status**: `200 OK`
- **Exemplo com entrada inválida (`/api/data-invalida`):**
  ```json
  {
    "error": "Invalid Date"
  }
  ```

---

## Instalação e Execução

### 1. Clonar ou navegar até o diretório
```bash
cd boilerplate-project-timestamp
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente (opcional)
Caso queira alterar a porta de execução padrão (3000), crie um arquivo `.env`:
```env
PORT=3000
```

### 4. Iniciar o servidor
```bash
npm start
```

O servidor será iniciado e ficará disponível em `http://localhost:3000`.

---

## Exemplos de Uso com cURL

```bash
# Data no formato ISO
curl http://localhost:3000/api/2016-12-25

# Timestamp numérico
curl http://localhost:3000/api/1451606400000

# Data atual
curl http://localhost:3000/api/

# Entrada inválida
curl http://localhost:3000/api/invalido
```
