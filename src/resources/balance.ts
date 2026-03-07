import prompts from 'prompts';
import { formatCurrency, printSuccess, printError, printResultWithFile } from '../utils.js';

export async function balanceMenu(beehive: any): Promise<boolean> {
  console.log('\n📊 Getting account balance...\n');

  try {
    try {
      // SDK: get balance
      const result = await beehive.balance.get();
      const sdkInfo = {
        resource: 'balance',
        method: 'get',
        environment: process.env.BEEHIVE_ENVIRONMENT || 'production',
      };
      printSuccess('Balance retrieved');
      printResultWithFile('balance-get', result, sdkInfo);
    } catch (error: any) {
      printError(error.message || 'Failed to get balance');
    }

    await prompts({
      type: 'text',
      name: 'continue',
      message: '👉 Press ENTER to continue...',
      
    });

    return false;
  } catch (error) {
    printError(`Unexpected error: ${error}`);
    return false;
  }
}
