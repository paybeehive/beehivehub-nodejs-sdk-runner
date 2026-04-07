import prompts from 'prompts';
import { loadPayload, printSuccess, printError, printResultWithFile } from '../utils.js';

export async function recipientsMenu(beehive: any): Promise<boolean> {
  const choice = await prompts({
    type: 'select',
    name: 'operation',
    message: '🎯 Recipients - Escolha uma operação:',
    choices: [
      { title: 'List Recipients', value: 'list' },
      { title: 'Get Recipient by ID', value: 'get' },
      { title: 'Create Recipient', value: 'create' },
      { title: 'Update Recipient', value: 'update' },
      { title: '← Back', value: 'back' },
    ],
  });

  if (!choice.operation || choice.operation === 'back') return false;

  try {
    switch (choice.operation) {
      case 'list': {
        try {
          // SDK: list recipients
          const result = await beehive.recipients.list();
          const sdkInfo = {
            resource: 'recipients',
            method: 'list',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess(`Found ${result.length} recipients`);
          printResultWithFile('recipients-list', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to list recipients');
        }
        break;
      }

      case 'get': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Recipient ID:',
        });

        const idNum = id ? Number.parseInt(id, 10) : Number.NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        try {
          // SDK: get recipient by id
          const result = await beehive.recipients.get(idNum);
          const sdkInfo = {
            resource: 'recipients',
            method: 'get',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Recipient retrieved');
          printResultWithFile('recipient-get', result, sdkInfo);


        } catch (error: any) {


          printError(error.message || 'Failed to perform operation');


        }
        break;
      }

      case 'create': {
        const payload = loadPayload('recipient-create.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/recipient-create.json\n');

        try {
          // SDK: create recipient
          const result = await beehive.recipients.create(payload);
          const sdkInfo = {
            resource: 'recipients',
            method: 'create',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Recipient created');
          printResultWithFile('recipient-create', result, sdkInfo);


        } catch (error: any) {


          printError(error.message || 'Failed to perform operation');


        }
        break;
      }

      case 'update': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Recipient ID:',
        });

        const idNum = id ? Number.parseInt(id, 10) : Number.NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        const payload = loadPayload('recipient-update.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/recipient-update.json\n');

        try {
          // SDK: update recipient
          const result = await beehive.recipients.update(idNum, payload);
          const sdkInfo = {
            resource: 'recipients',
            method: 'update',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Recipient updated');
          printResultWithFile('recipient-update', result, sdkInfo);


        } catch (error: any) {


          printError(error.message || 'Failed to perform operation');


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
