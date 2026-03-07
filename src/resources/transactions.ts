import prompts from 'prompts';
import { loadPayload, printSuccess, printError, printResultWithFile } from '../utils.js';

export async function transactionsMenu(beehive: any): Promise<boolean> {
  const choice = await prompts({
    type: 'select',
    name: 'operation',
    message: '💳 Transactions - Escolha uma operação:',
    choices: [
      { title: 'List Transactions', value: 'list' },
      { title: 'Get Transaction by ID', value: 'get' },
      { title: 'Create Transaction', value: 'create' },
      { title: 'Refund Transaction', value: 'refund' },
      { title: 'Update Delivery Status', value: 'delivery' },
      { title: '← Back', value: 'back' },
    ],
  });

  if (!choice.operation || choice.operation === 'back') return false;

  try {
    switch (choice.operation) {
      case 'list': {
        const input = await prompts({
          type: 'text',
          name: 'queryParams',
          message: 'Query params (ex: limit=100&offset=0&createdFrom=2026-01-01T00:00:00 ou vazio para todos):',
          initial: '',
        });

        // User can cancel or leave empty
        if (input.queryParams === undefined) {
          printError('Cancelled');
          break;
        }

        console.log('\n⏳ Loading...\n');
        
        try {
          // Parse query params to object (empty string = no params)
          const params = input.queryParams 
            ? Object.fromEntries(new URLSearchParams(input.queryParams).entries())
            : {};
          
          // SDK: list transactions
          const result = await beehive.transactions.list(params);
          
          const sdkInfo = {
            resource: 'transactions',
            method: 'list',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          
          if (!result) {
            printError('No data returned from API');
          } else if (Array.isArray(result)) {
            printSuccess(`Found ${result.length} transactions`);
            printResultWithFile('transactions-list', result, sdkInfo);
          } else {
            printSuccess('Transaction data retrieved');
            printResultWithFile('transactions-list', result, sdkInfo);
          }
        } catch (error: any) {
          printError(error.message || 'Failed to list transactions');
        }
        break;
      }

      case 'get': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Transaction ID:',
        });

        const idNum = id ? parseInt(id, 10) : NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        try {
          // SDK: get transaction by id
          const result = await beehive.transactions.get(idNum);
          const sdkInfo = {
            resource: 'transactions',
            method: 'get',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Transaction retrieved');
          printResultWithFile('transaction-get', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to get transaction');
        }
        break;
      }

      case 'create': {
        const payload = loadPayload('transaction-create.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/transaction-create.json');
        console.log('💡 Edit this file to change the transaction data\n');

        try {
          // SDK: create transaction
          const result = await beehive.transactions.create(payload);
          const sdkInfo = {
            resource: 'transactions',
            method: 'create',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Transaction created');
          printResultWithFile('transaction-create', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to create transaction');
        }
        break;
      }

      case 'refund': {
        const input = await prompts([
          { type: 'text', name: 'id', message: 'Transaction ID:' },
          { type: 'number', name: 'amount', message: 'Amount (leave empty for full refund):' },
        ]);

        const idNum = input.id ? parseInt(input.id, 10) : NaN;
        if (!input.id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        try {
          // SDK: refund transaction
          const result = await beehive.transactions.refund(idNum, input.amount || undefined);
          const sdkInfo = {
            resource: 'transactions',
            method: 'refund',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Transaction refunded');
          printResultWithFile('transaction-refund', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to refund transaction');
        }
        break;
      }

      case 'delivery': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Transaction ID:',
        });

        const idNum = id ? parseInt(id, 10) : NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        const payload = loadPayload('delivery-update.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/delivery-update.json\n');

        try {
          // SDK: update delivery status
          const result = await beehive.transactions.updateDelivery(idNum, payload);
          const sdkInfo = {
            resource: 'transactions',
            method: 'updateDelivery',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Delivery status updated');
          printResultWithFile('transaction-delivery-update', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to update delivery status');
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
