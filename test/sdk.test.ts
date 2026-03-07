/**
 * Smoke test: valida que o SDK é importado e instanciado corretamente.
 * Não faz chamadas à API - apenas verifica a integração local.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import BeehiveHub from '../src/sdk.js';

describe('SDK integration', () => {
  it('should instantiate client with dummy key', () => {
    const client = BeehiveHub('sk_test_dummy', { environment: 'sandbox' });
    assert.ok(client, 'client should be defined');
  });

  it('should expose expected resources', () => {
    const client = BeehiveHub('sk_test_dummy', { environment: 'sandbox' });
    const resources = [
      'transactions',
      'customers',
      'recipients',
      'bankAccounts',
      'transfers',
      'company',
      'balance',
      'paymentLinks',
    ];
    for (const resource of resources) {
      assert.ok(
        (client as any)[resource],
        `client.${resource} should be defined`
      );
    }
  });
});
