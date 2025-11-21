import { defineConfig } from "cypress";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente do .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000'
    },
  },
});
