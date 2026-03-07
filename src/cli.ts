#!/usr/bin/env node
import prompts from 'prompts';
import dotenv from 'dotenv';
import BeehiveHub from './sdk.js';
import { transactionsMenu } from './resources/transactions.js';
import { customersMenu } from './resources/customers.js';
import { balanceMenu } from './resources/balance.js';
import { paymentLinksMenu } from './resources/paymentLinks.js';
import { companyMenu } from './resources/company.js';
import { recipientsMenu } from './resources/recipients.js';
import { bankAccountsMenu } from './resources/bank-accounts.js';
import { transfersMenu } from './resources/transfers.js';

dotenv.config();

// Variáveis de ambiente (carregadas do .env)
const BEEHIVE_SECRET_KEY = process.env.BEEHIVE_SECRET_KEY;
const BEEHIVE_ENVIRONMENT = (process.env.BEEHIVE_ENVIRONMENT as 'production' | 'sandbox') || 'production';

if (!BEEHIVE_SECRET_KEY) {
  console.error('\n❌ Error: BEEHIVE_SECRET_KEY not found in .env file');
  console.error('💡 Create a .env file and add: BEEHIVE_SECRET_KEY=your_key_here\n');
  process.exit(1);
}

// Instanciação do SDK Beehive Hub
const beehive = BeehiveHub(BEEHIVE_SECRET_KEY, {
  environment: BEEHIVE_ENVIRONMENT
});

async function mainMenu(): Promise<void> {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🐝 Beehive Hub SDK Runner');
  console.log(`🌐 Environment: ${BEEHIVE_ENVIRONMENT.toUpperCase()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const choice = await prompts({
    type: 'select',
    name: 'resource',
    message: 'Escolha um recurso:',
    choices: [
      { title: '💳 Transactions', value: 'transactions' },
      { title: '👥 Customers', value: 'customers' },
      { title: '🔗 Payment Links', value: 'paymentLinks' },
      { title: '🎯 Recipients', value: 'recipients' },
      { title: '🏦 Bank Accounts', value: 'bankAccounts' },
      { title: '💸 Transfers', value: 'transfers' },
      { title: '🏢 Company', value: 'company' },
      { title: '📊 Balance', value: 'balance' },
      { title: '❌ Exit', value: 'exit' },
    ],
  });

  if (!choice.resource || choice.resource === 'exit') {
    console.log('\n👋 Até logo!\n');
    process.exit(0);
  }

  let shouldReturn = false;

  switch (choice.resource) {
    case 'transactions':
      shouldReturn = await transactionsMenu(beehive);
      break;
    case 'customers':
      shouldReturn = await customersMenu(beehive);
      break;
    case 'paymentLinks':
      shouldReturn = await paymentLinksMenu(beehive);
      break;
    case 'recipients':
      shouldReturn = await recipientsMenu(beehive);
      break;
    case 'bankAccounts':
      shouldReturn = await bankAccountsMenu(beehive);
      break;
    case 'transfers':
      shouldReturn = await transfersMenu(beehive);
      break;
    case 'company':
      shouldReturn = await companyMenu(beehive);
      break;
    case 'balance':
      await balanceMenu(beehive);
      break;
  }

  if (shouldReturn) {
    await mainMenu();
  } else {
    await mainMenu();
  }
}

prompts.override({ onCancel: () => process.exit(0) });

mainMenu().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
