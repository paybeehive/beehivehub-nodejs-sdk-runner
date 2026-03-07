import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cwd } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Get output directory from env or use default
const getOutputDir = (): string => {
  if (process.env.OUTPUT_DIR) {
    return process.env.OUTPUT_DIR;
  }
  // Default: output directory at project root
  return join(cwd(), 'output');
};

export function loadPayload(filename: string): any {
  try {
    const payloadPath = join(__dirname, '..', 'payloads', filename);
    const content = readFileSync(payloadPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading payload ${filename}:`, error);
    return null;
  }
}

export function saveOutput(operation: string, data: any, sdkInfo?: {
  resource: string;
  method: string;
  environment: string;
}): string {
  try {
    const outputDir = getOutputDir();
    
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `${operation}-${timestamp}.json`;
    const filepath = join(outputDir, filename);
    
    // Build output structure
    const output: any = {};
    
    if (sdkInfo) {
      output.sdk_call = {
        resource: sdkInfo.resource,
        method: sdkInfo.method,
        environment: sdkInfo.environment,
      };
    }
    
    output.response = data ?? null;
    
    const jsonString = JSON.stringify(output, null, 2);
    
    writeFileSync(filepath, jsonString, 'utf-8');
    
    return filename;
  } catch (error) {
    console.error(`❌ Error saving output:`, error);
    return '';
  }
}

export function formatCurrency(amountInCents: number): string {
  return `R$ ${(amountInCents / 100).toFixed(2)}`;
}

export function printSuccess(message: string): void {
  console.log(`\n✅ ${message}`);
}

export function printError(message: string): void {
  console.error(`\n❌ ${message}`);
}

export function printResult(data: any): void {
  // Mostra apenas um resumo muito pequeno
  if (Array.isArray(data)) {
    console.log(`\n📊 Array with ${data.length} items`);
    if (data.length > 0) {
      console.log(`   First item ID: ${data[0].id || 'N/A'}`);
    }
  } else if (typeof data === 'object') {
    console.log(`\n📊 Object with ${Object.keys(data).length} properties`);
    if (data.id) {
      console.log(`   ID: ${data.id}`);
    }
  } else {
    console.log('\n📊 Result:', data);
  }
}

export function printResultWithFile(operation: string, data: any, sdkInfo?: {
  resource: string;
  method: string;
  environment: string;
}): void {
  const filename = saveOutput(operation, data, sdkInfo);
  
  if (filename) {
    console.log(`📁 Full result saved to: output/${filename}`);
  }
}
