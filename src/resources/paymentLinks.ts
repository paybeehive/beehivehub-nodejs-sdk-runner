import prompts from 'prompts';
import {
  loadPayload,
  printSuccess,
  printError,
  printResultWithFile,
} from '../utils.js';

export async function paymentLinksMenu(beehive: any): Promise<boolean> {
  const choice = await prompts({
    type: 'select',
    name: 'operation',
    message: '🔗 Payment Links - Escolha uma operação:',
    choices: [
      { title: 'List Payment Links', value: 'list' },
      { title: 'Get Payment Link by ID', value: 'get' },
      { title: 'Create Payment Link', value: 'create' },
      { title: 'Update Payment Link', value: 'update' },
      { title: 'Delete Payment Link', value: 'delete' },
      { title: '← Back', value: 'back' },
    ],
  });

  if (!choice.operation || choice.operation === 'back') return false;

  try {
    switch (choice.operation) {
      case 'list': {
        console.log('\n⏳ Loading...\n');

        try {
          // SDK: list payment links
          const result = await beehive.paymentLinks.list();

          const sdkInfo = {
            resource: 'paymentLinks',
            method: 'list',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };

          if (!result) {
            printError('No data returned from API');
          } else if (Array.isArray(result)) {
            printSuccess(`Found ${result.length} payment links`);
            printResultWithFile('payment-links-list', result, sdkInfo);
          } else {
            printSuccess('Payment links data retrieved');
            printResultWithFile('payment-links-list', result, sdkInfo);
          }
        } catch (error: any) {
          printError(error.message || 'Failed to list payment links');
        }
        break;
      }

      case 'get': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Payment Link ID:',
        });

        const idNum = id ? Number.parseInt(id, 10) : Number.NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        try {
          // SDK: get payment link by id
          const result = await beehive.paymentLinks.get(idNum);
          const sdkInfo = {
            resource: 'paymentLinks',
            method: 'get',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Payment link retrieved');
          printResultWithFile('payment-link-get', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to get payment link');
        }
        break;
      }

      case 'create': {
        const payload = loadPayload('payment-link-create.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/payment-link-create.json');
        console.log('💡 Edit this file to change the payment link data\n');

        try {
          // SDK: create payment link
          const result = await beehive.paymentLinks.create(payload);
          const sdkInfo = {
            resource: 'paymentLinks',
            method: 'create',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Payment link created');
          if (result?.url) {
            console.log(`🔗 URL: ${result.url}`);
          }
          printResultWithFile('payment-link-create', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to create payment link');
        }
        break;
      }

      case 'update': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Payment Link ID:',
        });

        const idNum = id ? Number.parseInt(id, 10) : Number.NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        const payload = loadPayload('payment-link-update.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/payment-link-update.json\n');

        try {
          // SDK: update payment link
          const result = await beehive.paymentLinks.update(idNum, payload);
          const sdkInfo = {
            resource: 'paymentLinks',
            method: 'update',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Payment link updated');
          printResultWithFile('payment-link-update', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to update payment link');
        }
        break;
      }

      case 'delete': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Payment Link ID:',
        });

        const idNum = id ? Number.parseInt(id, 10) : Number.NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        try {
          // SDK: delete payment link
          await beehive.paymentLinks.delete(idNum);
          const sdkInfo = {
            resource: 'paymentLinks',
            method: 'delete',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Payment link deleted');
          printResultWithFile('payment-link-delete', { deleted: true, id: idNum }, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to delete payment link');
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
