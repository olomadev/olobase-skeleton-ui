// Env.mjs
import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const envFile = process.env.ENV;
const __dirname = dirname(fileURLToPath(import.meta.url));
const env = dotenv.config({ path: resolve(__dirname, `.env.${envFile}`) });

class Env {
  getVariables() {
    return {
      'process.env.BASE_URL': JSON.stringify(env.parsed.BASE_URL),
      'process.env.API_URL': JSON.stringify(env.parsed.API_URL),
      'process.env.HCAPTCHA_SITE_KEY': JSON.stringify(env.parsed.HCAPTCHA_SITE_KEY),
      'process.env.SESSION_UPDATE_TIME': JSON.stringify(env.parsed.SESSION_UPDATE_TIME),
      'process.env.COOKIE': JSON.stringify(env.parsed.COOKIE),
      'process.env.ENV': JSON.stringify(env.parsed.ENV || 'development'),
      'process.env.NODE_ENV': JSON.stringify(env.parsed.ENV || 'development'),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    };
  }
}
// Singleton Instance
const envInstance = new Env();
export default envInstance;
