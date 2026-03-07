import prompts from 'prompts';
import { loadPayload, printSuccess, printError, printResultWithFile } from '../utils.js';

export async function customersMenu(beehive: any): Promise<boolean> {
  const choice = await prompts({
    type: 'select',
    name: 'operation',
    message: '👥 Customers - Escolha uma operação:',
    choices: [
      { title: 'List Customers', value: 'list' },
      { title: 'Get Customer by ID', value: 'get' },
      { title: 'Create Customer', value: 'create' },
      { title: '← Back', value: 'back' },
    ],
  });

  if (!choice.operation || choice.operation === 'back') return false;

  try {
    switch (choice.operation) {
      case 'list': {
        const { email } = await prompts({
          type: 'text',
          name: 'email',
          message: 'Email (obrigatório para buscar clientes):',
        });

        if (!email) {
          printError('Email is required');
          break;
        }

        console.log('\n⏳ Loading...\n');

        try {
          // SDK: list customers
          const result = await beehive.customers.list({ email });
          const sdkInfo = {
            resource: 'customers',
            method: 'list',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess(`Found ${result.length} customers`);
          printResultWithFile('customers-list', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to list customers');
        }
        break;
      }

      case 'get': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Customer ID:',
        });

        const idNum = id ? parseInt(id, 10) : NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        try {
          const result = await beehive.customers.get(idNum);
          const sdkInfo = {
            resource: 'customers',
            method: 'get',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Customer retrieved');
          printResultWithFile('customer-get', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to get customer');
        }
        break;
      }

      case 'create': {
        const payload = loadPayload('customer-create.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/customer-create.json');
        console.log('💡 Edit this file to change the customer data\n');

        try {
          // SDK: create customer
          const result = await beehive.customers.create(payload);
          const sdkInfo = {
            resource: 'customers',
            method: 'create',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Customer created');
          printResultWithFile('customer-create', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to create customer');
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
