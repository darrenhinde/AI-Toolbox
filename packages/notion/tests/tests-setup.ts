import dotenv from 'dotenv';

export function setupEnvironment() {
  dotenv.config();

  const requiredEnvVars = ['NOTION_API_KEY', 'TEST_PAGE_ID'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} environment variable is not set`);
    }
  }
}