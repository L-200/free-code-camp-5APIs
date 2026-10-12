# Request Header Parser Microservice

Microsserviço de inspeção e extração de cabeçalhos HTTP desenvolvido para a certificação Back End Development and APIs do freeCodeCamp. Esta API tem como finalidade inspecionar a requisição de entrada para obter informações sobre a origem da conexão, configurações regionais e especificações do software cliente.

---

## Tecnologias e Dependências

- **Node.js**: Ambiente de execução para código JavaScript no backend.
- **Express (v4.x)**: Framework HTTP para gerenciamento de rotas e middlewares.
- **CORS**: Habilita o acesso por clientes hospedados em outros domínios ou portas.
- **Dotenv**: Gerenciamento de variáveis de ambiente a partir de arquivo `.env`.

---

## Como Funciona a Extração dos Dados

Quando uma requisição chega ao endpoint `/api/whoami`, o Express processa o objeto de requisição (`req`) da seguinte forma:

1. **Endereço IP (`ipaddress`)**:
   Obtido através da propriedade `req.ip`. Caso a aplicação esteja atrás de um proxy ou balanceador de carga, o Express pode ser configurado para ler o cabeçalho `X-Forwarded-For`.

2. **Idioma do Cliente (`language`)**:
   Extraído diretamente do cabeçalho HTTP `Accept-Language` (`req.headers['accept-language']`). Esse valor informa as linguagens aceitas pelo navegador em ordem de preferência (ex: `pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7`).

3. **Software e Sistema Operacional (`software`)**:
   Extraído do cabeçalho HTTP `User-Agent` (`req.headers['user-agent']`). Informa a cadeia de identificação do navegador, motor de renderização e plataforma operacional do usuário.

---

## Endpoints

### 1. Página Inicial
- **Método**: `GET`
- **Rota**: `/`
- **Descrição**: Serve a página inicial estática (`views/index.html`) com a apresentação do serviço.

### 2. Endpoint de Boas-Vindas
- **Método**: `GET`
- **Rota**: `/api/hello`
- **Resposta**:
  ```json
  {
    "greeting": "hello API"
  }
  ```

### 3. Identificação do Cliente
- **Método**: `GET`
- **Rota**: `/api/whoami`
- **Descrição**: Analisa os cabeçalhos da requisição HTTP do cliente e retorna os metadados extraídos.

#### Resposta de Sucesso:
- **Status**: `200 OK`
- **Formato**: `application/json`
- **Exemplo de Retorno**:
  ```json
  {
    "ipaddress": "::ffff:127.0.0.1",
    "language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "software": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
  ```

---

## Instalação e Execução

### 1. Clonar ou navegar até o diretório
```bash
cd boilerplate-project-headerparser
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente (opcional)
Crie um arquivo `.env` para especificar a porta do servidor, se necessário:
```env
PORT=3000
```

### 4. Iniciar o servidor
```bash
npm start
```

O serviço iniciará na porta configurada (padrão 3000): `http://localhost:3000`.

---

## Exemplo de Uso com cURL

```bash
# Requisição direta
curl http://localhost:3000/api/whoami

# Simulando cabeçalhos específicos
curl -H "Accept-Language: pt-BR,en;q=0.5" \
     -H "User-Agent: CustomClient/1.0" \
     http://localhost:3000/api/whoami
```
