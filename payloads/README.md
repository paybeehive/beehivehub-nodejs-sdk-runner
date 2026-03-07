# 📄 Payloads Reference

Este diretório contém os payloads editáveis para operações POST/PUT da API.

## 🎯 Como Usar

1. **Edite o arquivo JSON** correspondente à operação desejada
2. **Execute o CLI** (`npm start`)
3. **Escolha a operação** no menu
4. **Veja o resultado** no terminal

## 📋 Arquivos Disponíveis

### transaction-create.json
Criar uma nova transação de pagamento.

**Campos principais:**
- `amount`: Valor em centavos (10000 = R$ 100,00)
- `payment_method`: "credit_card", "boleto", "pix"
- `card_hash`: Hash do cartão (gerado no frontend)
- `customer`: Dados do cliente
- `items`: Lista de produtos/serviços

### customer-create.json
Criar um novo cliente.

**Campos principais:**
- `name`: Nome completo
- `email`: Email válido
- `documents`: Array com CPF/CNPJ
- `phone_numbers`: Array de telefones

### payment-link-create.json
Criar um link de pagamento hospedado.

**Campos principais:**
- `amount`: Valor em centavos
- `payment_methods`: Array de métodos aceitos (ex: ["pix", "credit_card", "boleto"])
- `max_installments`: Número máximo de parcelas
- `success_url`: URL de retorno após pagamento
- `description`: Descrição do pagamento

### payment-link-update.json
Atualizar um link de pagamento existente.

### recipient-create.json
Criar um recebedor para split de pagamento.

**Campos principais:**
- `transfer_interval`: "daily", "weekly", "monthly"
- `transfer_enabled`: true/false
- `bank_account`: Dados da conta bancária

### recipient-update.json
Atualizar configurações de um recebedor.

### bank-account-create.json
Criar uma conta bancária.

**Campos principais:**
- `bank_code`: Código do banco (ex: "001", "237", "341")
- `agencia`: Número da agência
- `conta`: Número da conta
- `conta_dv`: Dígito verificador
- `type`: "conta_corrente" ou "conta_poupanca"

### transfer-create.json
Criar uma transferência.

**Opção 1 - Com recipient_id:**
```json
{
  "amount": 50000,
  "recipient_id": "re_abc123"
}
```

**Opção 2 - Com bank_account:**
```json
{
  "amount": 50000,
  "bank_account": { ... }
}
```

### company-update.json
Atualizar dados da empresa.

### delivery-update.json
Atualizar status de entrega de uma transação.

**Status válidos:**
- "processing"
- "shipped"
- "delivered"
- "returned"

## 💡 Dicas

### Testar Múltiplos Cenários

Crie variações para testar:
- Valores diferentes
- Métodos de pagamento diferentes
- Campos opcionais preenchidos/vazios
- Dados inválidos (para ver tratamento de erro)

### Valores em Centavos

**Importante:** Todos os valores monetários são em centavos!

```
R$ 1,00    = 100 centavos
R$ 10,00   = 1000 centavos
R$ 100,00  = 10000 centavos
R$ 1.000,00 = 100000 centavos
```

### IDs Dinâmicos

Para operações que requerem IDs (GET, refund, update), o CLI pedirá o ID no momento da execução. Não precisa editar payloads para isso.

### Emails Únicos

Para criar múltiplos clientes ou payment links, varie o email:
- `test1@example.com`
- `test2@example.com`
- ou use timestamp: `test${Date.now()}@example.com` (faça manualmente)

## 🔄 Workflow Recomendado

1. **Primeiro:** Liste os recursos existentes (List)
2. **Copie IDs** que você quer manipular
3. **Edite payloads** conforme necessário
4. **Execute operações** CREATE/UPDATE
5. **Verifique resultados** com GET

## ⚠️ Notas Importantes

- **card_hash:** Para criar transações, você precisa de um card_hash válido gerado no frontend
- **Ambiente:** Certifique-se de estar usando as credenciais corretas (sandbox/production)
- **Saldo:** Transfers requerem saldo disponível na conta

---

💡 **Tip:** Use Ctrl+C para sair do CLI a qualquer momento
