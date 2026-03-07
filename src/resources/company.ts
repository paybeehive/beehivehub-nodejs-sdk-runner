import prompts from 'prompts';
import { loadPayload, printSuccess, printError, printResultWithFile } from '../utils.js';

export async function companyMenu(beehive: any): Promise<boolean> {
  const choice = await prompts({
    type: 'select',
    name: 'operation',
    message: '🏢 Company - Escolha uma operação:',
    choices: [
      { title: 'Get Company Info', value: 'get' },
      { title: 'Update Company Info', value: 'update' },
      { title: '← Back', value: 'back' },
    ],
  });

  if (!choice.operation || choice.operation === 'back') return false;

  try {
    switch (choice.operation) {
      case 'get': {
        try {
          // SDK: get company info
          const result = await beehive.company.get();
          const sdkInfo = {
            resource: 'company',
            method: 'get',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Company info retrieved');
          printResultWithFile('company-get', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to get company info');
        }
        break;
      }

      case 'update': {
        const payload = loadPayload('company-update.json');
        if (!payload) break;

        console.log('\n📄 Using payload from: payloads/company-update.json');
        console.log('💡 Edit this file to change the company data\n');

        try {
          // SDK: update company info
          const result = await beehive.company.update(payload);
          const sdkInfo = {
            resource: 'company',
            method: 'update',
            environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
          };
          printSuccess('Company info updated');
          printResultWithFile('company-update', result, sdkInfo);
        } catch (error: any) {
          printError(error.message || 'Failed to update company info');
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
