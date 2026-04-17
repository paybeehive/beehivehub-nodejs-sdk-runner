# Beehive Hub SDK Runner

🚀 CLI interativo para consumir e validar o SDK [@paybeehive/beehivehub-nodejs-sdk](https://www.npmjs.com/package/@paybeehive/beehivehub-nodejs-sdk).

## 📋 Sobre o Projeto

Este é um projeto de desenvolvimento interno para consumir e validar todas as funcionalidades do SDK Beehive Hub de forma prática e interativa.

**Não é um projeto de testes automatizados** - é uma ferramenta para desenvolvedores executarem operações da API de forma manual e controlada através de um menu interativo no terminal.

## 🚀 Setup Rápido

```bash
# 0. Clonar (se obtendo do GitHub)
git clone https://github.com/paybeehive/beehivehub-sdk-runner.git
cd beehivehub-sdk-runner

# 1. Instalar dependências
npm install

# 2. Configurar .env
BEEHIVE_SECRET_KEY=your_secret_key_here
BEEHIVE_ENVIRONMENT=production  # ou 'sandbox'
# OUTPUT_DIR=./custom-output  # (opcional) customize o diretório de saída

# 3. Executar
npm start
```

### 🌐 Ambientes

O SDK suporta dois ambientes:

- **`production`** (padrão) - API de produção
- **`sandbox`** - API de sandbox/testes

Configure no `.env`:

```env
# Produção (padrão)
BEEHIVE_SECRET_KEY=sk_live_abc...
# BEEHIVE_ENVIRONMENT=production

# Sandbox
BEEHIVE_SECRET_KEY=sk_test_xyz...
BEEHIVE_ENVIRONMENT=sandbox
```

O ambiente atual é mostrado no topo do CLI.

## 💻 Como Usar

### Executar o CLI

```bash
npm start
```

Você verá um menu interativo:

```
🐝 Beehive Hub SDK Runner

? Escolha um recurso: 
  💳 Transactions
  👥 Customers
  🔗 Payment Links
  🎯 Recipients
  🏦 Bank Accounts
  💸 Transfers
  🏢 Company
  📊 Balance
  ❌ Exit
```

### 📁 Salvamento Automático das Respostas

**IMPORTANTE**: Todas as respostas da API são **automaticamente salvas** na pasta `output/` no formato:

```
output/{funcionalidade}-{timestamp}.json
```

**No terminal você verá apenas um resumo**, por exemplo:

```
✅ Transaction created

📊 ID: txn_abc123xyz
📁 Full result saved to: output/transaction-create-2026-02-19T12-30-45.json
```

O JSON completo está no arquivo, não no terminal! 🎯

### ⚙️ Configurar Diretório de Saída (Opcional)

Por padrão, os arquivos são salvos em `./output`. Para customizar, adicione no `.env`:

```env
OUTPUT_DIR=/caminho/customizado/output
```

### Workflow Típico

1. **Escolha o recurso** (ex: Transactions)
2. **Escolha a operação** (ex: List, Get, Create)
3. **Para GET:** Digite o ID quando solicitado
4. **Para CREATE/UPDATE:** O payload do arquivo JSON será usado
5. **Veja o resultado** formatado no terminal
6. **Volte ao menu** para nova operação

### Editar Payloads

Os payloads ficam em `payloads/*.json`:

```
payloads/
├── transaction-create.json       # Criar transação
├── customer-create.json          # Criar cliente
├── payment-link-create.json     # Criar link de pagamento
├── payment-link-update.json     # Atualizar link de pagamento
├── recipient-create.json        # Criar recebedor
├── recipient-update.json         # Atualizar recebedor
├── bank-account-create.json      # Criar conta bancária
├── transfer-create.json          # Transferência com recipient_id
├── transfer-create-with-account.json  # Transferência com conta
├── company-update.json           # Atualizar empresa
└── delivery-update.json          # Atualizar entrega
```

**Para testar diferentes cenários:**
1. Edite o arquivo JSON
2. Execute a operação no menu
3. Ajuste conforme necessário
4. Execute novamente

## 📖 Recursos Disponíveis

### 💳 Transactions
- **List Transactions** - Lista com filtros (limit, offset, createdFrom, etc.)
- **Get Transaction** - Busca por ID
- **Create Transaction** - Usa `transaction-create.json`
- **Refund Transaction** - Estorno total ou parcial
- **Update Delivery** - Usa `delivery-update.json`

### 👥 Customers
- **List Customers** - Busca por email (obrigatório; não aceita paginação)
- **Get Customer** - Busca por ID
- **Create Customer** - Usa `customer-create.json`

### 🔗 Payment Links
- **List Payment Links** - Lista todos
- **Get Payment Link** - Busca por ID
- **Create Payment Link** - Usa `payment-link-create.json`
- **Update Payment Link** - Usa `payment-link-update.json`
- **Delete Payment Link** - Remove por ID

### 🎯 Recipients
- **List Recipients** - Lista todos
- **Get Recipient** - Busca por ID
- **Create Recipient** - Usa `recipient-create.json`
- **Update Recipient** - Usa `recipient-update.json`

### 🏦 Bank Accounts
- **List Bank Accounts** - Lista por Recipient ID
- **Create Bank Account** - Usa `bank-account-create.json`

> Bank Accounts são vinculados a um Recipient. Informe o ID do recipient para listar ou criar.

### 💸 Transfers
- **Create Transfer** - Usa `transfer-create.json`
- **Get Transfer** - Busca por ID

### 🏢 Company
- **Get Company Info** - Dados da empresa
- **Update Company** - Usa `company-update.json`

### 📊 Balance
- **Get Balance** - Saldo disponível, aguardando e transferido

## 📁 Estrutura do Projeto

```
beehivehub-sdk-runner/
├── src/
│   ├── cli.ts              # Menu principal
│   ├── sdk.ts              # Import do SDK
│   ├── check-env.ts        # Validação de variáveis de ambiente
│   ├── utils.ts            # Funções auxiliares
│   └── resources/          # Handlers por recurso
│       ├── transactions.ts
│       ├── customers.ts
│       ├── balance.ts
│       ├── paymentLinks.ts
│       ├── company.ts
│       ├── recipients.ts
│       ├── bank-accounts.ts
│       └── transfers.ts
├── payloads/               # Payloads editáveis
│   ├── *.json              # Payloads principais
│   ├── examples/           # Exemplos de variações
│   └── README.md           # Documentação dos payloads
├── .env                    # Credenciais (não versionar!)
├── .env.example            # Template
├── package.json
└── README.md
```

## 🧪 Testes

O projeto inclui um smoke test que valida a integração com o SDK (sem chamadas à API):

```bash
npm test
```

## 🛠️ Stack Tecnológica

- **TypeScript** - Tipagem e melhor DX
- **tsx** - Executor TypeScript (sem necessidade de build)
- **prompts** - Menu interativo no terminal
- **dotenv** - Gerenciamento de credenciais
- **@paybeehive/beehivehub-nodejs-sdk** - SDK oficial via npm

## 🔧 Atualizar o SDK

O runner usa o SDK publicado no npm (`^1.0.0` no `package.json`). Quando uma nova versão do SDK é publicada (ex: 1.0.1), o `npm install` sozinho **não** atualiza — o `package-lock.json` mantém a versão instalada.

Para obter a última versão compatível:

```bash
npm update @paybeehive/beehivehub-nodejs-sdk
```

Para forçar nova resolução (ex: após mudança de versão major):

```bash
rm package-lock.json && npm install
```

## 💡 Exemplos de Uso

### Cenário 1: Criar e Consultar Cliente

1. Execute `npm start`
2. Escolha "👥 Customers"
3. Escolha "Create Customer"
4. Veja o ID retornado (ex: `cust_abc123`)
5. Volte e escolha "Get Customer by ID"
6. Digite o ID
7. Veja os dados completos

### Cenário 2: Testar Diferentes Métodos de Pagamento

**Transação PIX:** Edite `payloads/transaction-create.json` com `payment_method: "pix"` e execute "Create Transaction".

**Transação Parcelada:** Edite `payloads/transaction-create.json` com `installments` e execute "Create Transaction".

### Cenário 3: Criar Payment Link e Testar Pagamento

1. Edite `payloads/payment-link-create.json`
2. Execute "Create Payment Link"
3. Copie a `url` retornada
4. Abra no navegador para testar
5. Use "Get Payment Link" para verificar status

## ⚠️ Notas Importantes

### Valores em Centavos

Todos os valores monetários são em centavos:
- R$ 10,00 = `10000`
- R$ 100,00 = `100000`
- R$ 1.000,00 = `1000000`

### Card Hash

Para criar transações com cartão, você precisa de um `card_hash` válido gerado no frontend. Use a biblioteca JavaScript da Beehive Hub.

### IDs Dinâmicos

Para operações que requerem IDs (GET, refund, update), copie os IDs retornados pelas operações de criação ou listagem.

### Ambiente

Certifique-se de usar as credenciais corretas:
- **Sandbox:** Para testes sem movimentação real
- **Production:** Para operações reais

## 🎯 Casos de Uso

### Validar Criação de Transação

1. Edite `payloads/transaction-create.json`
2. Varie: amount, payment_method, installments
3. Execute múltiplas vezes com dados diferentes
4. Valide os resultados

### Testar Fluxo Completo

1. Crie um cliente → Copie o ID
2. Crie um payment link → Copie a URL
3. Verifique o saldo
4. Liste transações recentes

### Validar Recebedores

1. Crie um recipient → Copie o ID
2. Liste recipients
3. Atualize configurações
4. Crie transfer usando o recipient_id

## 📝 Convenções

- **Emails únicos:** Varie o email em cada criação
- **IDs válidos:** Use IDs reais obtidos da API
- **Payloads válidos:** Siga a estrutura da documentação oficial

## 🔍 Debug

Se encontrar erros:

1. **Verifique o payload JSON** - Sintaxe correta?
2. **Confira as credenciais** - API key válida?
3. **Veja a mensagem de erro** - API retorna detalhes
4. **Consulte a documentação** - https://docs.beehivehub.io

## 📞 Suporte

- 📧 Email: support@paybeehive.com.br
- 📚 Docs: https://docs.beehivehub.io
- 🐛 Issues: https://github.com/paybeehive/beehivehub-nodejs-sdk/issues
- 📦 SDK: https://www.npmjs.com/package/@paybeehive/beehivehub-nodejs-sdk

---

✨ Desenvolvido com ❤️ pela equipe Beehive Hub
