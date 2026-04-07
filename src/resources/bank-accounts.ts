import prompts from 'prompts';
import { loadPayload, printSuccess, printError, printResultWithFile } from '../utils.js';

export async function bankAccountsMenu(beehive: any): Promise<boolean> {
  const choice = await prompts({
    type: 'select',
    name: 'operation',
    message: '🏦 Bank Accounts - Escolha uma operação:',
    choices: [
      { title: 'List Bank Accounts', value: 'list' },
      { title: 'Create Bank Account', value: 'create' },
      { title: '← Back', value: 'back' },
    ],
  });

  if (!choice.operation || choice.operation === 'back') return false;

  try {
    switch (choice.operation) {
      case 'list': {
        const { recipientId } = await prompts({
          type: 'text',
          name: 'recipientId',
          message: 'Recipient ID:',
        });

        const recipientIdNum = recipientId ? Number.parseInt(recipientId, 10) : Number.NaN;
        if (!recipientId || Number.isNaN(recipientIdNum)) {
          printError('Valid numeric Recipient ID is required');
          break;
        }

        try {
          // SDK: list bank accounts
          const result = await beehive.bankAccounts.list(recipientIdNum);
          const sdkInfo = {
            resource: 'bankAccounts',
            method: 'list',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess(`Found ${result.length} bank accounts`);
          printResultWithFile('bank-accounts-list', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to list bank accounts');
        }
        break;
      }

      case 'create': {
        const { recipientId } = await prompts({
          type: 'text',
          name: 'recipientId',
          message: 'Recipient ID:',
        });

        const recipientIdNum = recipientId ? Number.parseInt(recipientId, 10) : Number.NaN;
        if (!recipientId || Number.isNaN(recipientIdNum)) {
          printError('Valid numeric Recipient ID is required');
          break;
        }

        const payload = loadPayload('bank-account-create.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/bank-account-create.json\n');

        try {
          // SDK: create bank account
          const result = await beehive.bankAccounts.create(recipientIdNum, payload);
          const sdkInfo = {
            resource: 'bankAccounts',
            method: 'create',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Bank account created');
          printResultWithFile('bank-account-create', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to create bank account');
        }
        break;
      }
    }

    await prompts({
      type: 'text',
      name: 'continue',
      message: '👉 Press ENTER to continue...',
      
    });

    return true;
  } catch (error) {
    printError(`Unexpected error: ${error}`);
    return true;
  }
}
