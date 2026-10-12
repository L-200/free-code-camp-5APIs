# File Metadata Microservice

Microsserviço de upload e análise de metadados de arquivos desenvolvido para a certificação Back End Development and APIs do freeCodeCamp. A aplicação recebe arquivos submetidos por clientes através de requisições multipart (`multipart/form-data`) e extrai propriedades estruturais do arquivo (nome original, tipo MIME e tamanho em bytes), retornando essas informações em formato JSON.

---

## Tecnologias e Dependências

- **Node.js**: Ambiente de execução para código JavaScript no servidor.
- **Express (v4.x)**: Framework HTTP para tratamento das requisições e roteamento.
- **Multer (v2.x)**: Middleware para manipulação de fluxos multipart (`multipart/form-data`), configurado com armazenamento em memória (`memoryStorage`), permitindo o processamento rápido do arquivo em buffer sem necessidade de escrita permanente no disco.
- **CORS**: Middleware para habilitar requisições entre diferentes origens.
- **Dotenv**: Gerenciamento de variáveis de ambiente.

---

## Como Funciona o Processamento de Arquivos

1. **Recepção de Requisição Multipart**:
   O cliente envia uma requisição `POST` para `/api/fileanalyse` com o cabeçalho `Content-Type: multipart/form-data`, contendo o arquivo no campo de formulário com nome `upfile`.

2. **Interceptação com Multer**:
   O middleware `upload.single('upfile')` intercepta o fluxo de upload, armazena temporariamente os bytes na memória RAM (`multer.memoryStorage()`) e anexa o objeto `file` à requisição (`req.file`).

3. **Extração de Metadados**:
   O controlador da rota acessa as propriedades de `req.file`:
   - `originalname`: Nome com o qual o arquivo foi salvo na máquina do cliente.
   - `mimetype`: Tipo de mídia do arquivo de acordo com a especificação MIME (ex: `image/png`, `application/pdf`, `text/plain`).
   - `size`: Tamanho total do arquivo medido em bytes.

4. **Resposta JSON**:
   Os metadados são estruturados em um objeto JSON e devolvidos ao cliente com status `200 OK`.

---

## Endpoints

### 1. Interface Web
- **Método**: `GET`
- **Rota**: `/`
- **Descrição**: Serve a página estática (`views/index.html`) contendo o formulário HTML com o campo de upload `<input type="file" name="upfile">`.

### 2. Análise de Metadados de Arquivo
- **Método**: `POST`
- **Rota**: `/api/fileanalyse`
- **Content-Type**: `multipart/form-data`
- **Form Data Field**:
  - `upfile` (arquivo binário, obrigatório)

#### Resposta de Sucesso:
- **Status**: `200 OK`
- **Content-Type**: `application/json`
- **Exemplo de Retorno:**
  ```json
  {
    "name": "relatorio-financeiro.pdf",
    "type": "application/pdf",
    "size": 245890
  }
  ```

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do diretório deste microsserviço caso deseje customizar a porta de execução:

```env
PORT=3000
```

---

## Instalação e Execução

### 1. Acessar o diretório
```bash
cd boilerplate-project-filemetadata
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o microsserviço
```bash
npm start
```

O servidor iniciará no endereço local padrão: `http://localhost:3000`.

---

## Exemplo de Uso com cURL

Para submeter um arquivo via linha de comando utilizando o utilitário cURL (a flag `-F` envia o arquivo no formato `multipart/form-data` com o campo `upfile`):

```bash
# Exemplo de envio de arquivo
curl -X POST -F "upfile=@./caminho/do/seu/arquivo.png" http://localhost:3000/api/fileanalyse
```

Exemplo de retorno esperado:
```json
{
  "name": "arquivo.png",
  "type": "image/png",
  "size": 54321
}
```
