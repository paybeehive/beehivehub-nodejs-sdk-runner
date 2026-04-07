import prompts from 'prompts';
import { loadPayload, printSuccess, printError, printResultWithFile } from '../utils.js';

export async function transfersMenu(beehive: any): Promise<boolean> {
  const choice = await prompts({
    type: 'select',
    name: 'operation',
    message: '💸 Transfers - Escolha uma operação:',
    choices: [
      { title: 'Create Transfer', value: 'create' },
      { title: 'Get Transfer by ID', value: 'get' },
      { title: '← Back', value: 'back' },
    ],
  });

  if (!choice.operation || choice.operation === 'back') return false;

  try {
    switch (choice.operation) {
      case 'create': {
        const payload = loadPayload('transfer-create.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/transfer-create.json');
        console.log('💡 Edit this file to change the transfer data\n');

        try {
          // SDK: create transfer
          const result = await beehive.transfers.create(payload);
          const sdkInfo = {
            resource: 'transfers',
            method: 'create',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Transfer created');
          printResultWithFile('transfer-create', result, sdkInfo);


        } catch (error: any) {


          printError(error.message || 'Failed to perform operation');


        }
        break;
      }

      case 'get': {
        const { id } = await prompts({
          type: 'text',
          name: 'id',
          message: 'Transfer ID:',
        });

        const idNum = id ? Number.parseInt(id, 10) : Number.NaN;
        if (!id || Number.isNaN(idNum)) {
          printError('Valid numeric ID is required');
          break;
        }

        try {
          // SDK: get transfer by id
          const result = await beehive.transfers.get(idNum);
          const sdkInfo = {
            resource: 'transfers',
            method: 'get',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Transfer retrieved');
          printResultWithFile('transfer-get', result, sdkInfo);


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
