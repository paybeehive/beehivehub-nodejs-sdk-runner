// Import do SDK Beehive Hub (CommonJS via createRequire para compatibilidade ESM)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const BeehiveHub = require('@paybeehive/beehivehub-nodejs-sdk').default || require('@paybeehive/beehivehub-nodejs-sdk');

// Export do cliente para uso no runner
export default BeehiveHub;
