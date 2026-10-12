# URL Shortener Microservice

Microsserviço de encurtamento e redirecionamento de links desenvolvido para a certificação Back End Development and APIs do freeCodeCamp. O serviço recebe uma URL informada pelo cliente, valida sua formatação e existência via resolução DNS, persiste a relação entre a URL original e um código identificador numérico em um banco de dados MongoDB, e executa o redirecionamento automático quando o link encurtado é acessado.

---

## Tecnologias e Dependências

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Express (v4.x)**: Roteamento de requisições HTTP e manipulação de fluxos de redirecionamento.
- **MongoDB**: Banco de dados NoSQL orientado a documentos utilizado para armazenar os mapeamentos de URL.
- **Mongoose (v5.x)**: Modelagem de objetos (ODM) para interação com o MongoDB.
- **Node.js DNS API (`dns.lookup`)**: Módulo nativo utilizado para verificar se o domínio informado possui registro DNS válido.
- **CORS**: Habilitação de requisições de origens cruzadas.
- **Dotenv**: Gerenciamento das variáveis de ambiente.

---

## Modelagem de Dados (Schema)

A coleção é gerenciada através do modelo Mongoose `Url`, composto pelos seguintes campos:

```javascript
{
  longVersion: { type: String, required: true },
  shortVersion: { type: Number, required: true, unique: true }
}
```

- `longVersion`: A URL original completa enviada pelo usuário.
- `shortVersion`: Um valor numérico inteiro sequencial e único que identifica o link encurtado.

---

## Regras de Negócio e Validação

1. **Validação de Formato e Protocolo**:
   A URL enviada no corpo da requisição é processada pela classe global `URL` do JavaScript. Caso o formato não seja válido ou falte o protocolo (como `http://` ou `https://`), a requisição cai no tratamento de exceção.

2. **Verificação de Domínio com DNS Lookup**:
   O hostname obtido da URL passa por uma resolução assíncrona através de `dns.lookup(hostname)`. Se o domínio não existir ou não resolver para um endereço IP válido na internet, a API rejeita a requisição retornando `{ "error": "Invalid URL" }`.

3. **Geração Sequencial de ID**:
   O identificador numérico é gerado localizando o registro com o maior `shortVersion` cadastrado (`findOne().sort({ shortVersion: -1 })`) e adicionando uma unidade (`last.shortVersion + 1`). Para o primeiro registro do banco, o valor inicial é 1.

4. **Redirecionamento**:
   Ao receber uma requisição em `/api/shorturl/:shorturl`, o serviço busca o documento com o valor numérico correspondente. Se encontrado, emite um redirecionamento HTTP imediato para a URL original (`res.redirect(...)`). Caso contrário, retorna `{ "error": "URL not found" }`.

---

## Endpoints

### 1. Interface Web
- **Método**: `GET`
- **Rota**: `/`
- **Descrição**: Entrega a página estática (`views/index.html`) com o formulário para submissão de URLs.

### 2. Encurtamento de URL
- **Método**: `POST`
- **Rota**: `/api/shorturl`
- **Headers**: `Content-Type: application/x-www-form-urlencoded` ou `application/json`
- **Body**:
  ```json
  {
    "url": "https://freecodecamp.org"
  }
  ```

#### Respostas:

**Sucesso (URL válida e domínio existente):**
- **Status**: `200 OK`
- **Exemplo de Retorno:**
  ```json
  {
    "original_url": "https://freecodecamp.org",
    "short_url": 1
  }
  ```

**Erro (URL inválida ou falha no DNS lookup):**
- **Status**: `200 OK`
- **Exemplo de Retorno:**
  ```json
  {
    "error": "Invalid URL"
  }
  ```

### 3. Redirecionamento por Código Encurtado
- **Método**: `GET`
- **Rota**: `/api/shorturl/:shorturl`
- **Parâmetros de Rota**:
  - `shorturl`: Identificador numérico da URL encurtada (ex: `1`).

#### Respostas:

**Sucesso:**
- **Status**: `302 Found`
- Redireciona o navegador para o endereço configurado em `original_url`.

**Erro (Identificador não localizado no banco):**
- **Status**: `200 OK`
- **Exemplo de Retorno:**
  ```json
  {
    "error": "URL not found"
  }
  ```

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do diretório deste microsserviço:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome-do-banco>?retryWrites=true&w=majority
```

> Nota: O valor de `MONGO_URI` pode apontar para uma instância local do MongoDB (`mongodb://localhost:27017/shorturl`) ou um cluster do MongoDB Atlas.

---

## Instalação e Execução

### 1. Acessar o diretório
```bash
cd boilerplate-project-urlshortener
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o microsserviço
```bash
npm start
```

O servidor iniciará na porta informada em `.env` ou na porta padrão 3000.

---

## Exemplos de Uso com cURL

```bash
# Encurtar uma URL válida
curl -X POST http://localhost:3000/api/shorturl \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "url=https://www.freecodecamp.org"

# Exemplo com URL inválida
curl -X POST http://localhost:3000/api/shorturl \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "url=https://site-inexistente-123456789.com"

# Seguir redirecionamento do link encurtado com cURL (-L flag)
curl -L http://localhost:3000/api/shorturl/1
```
