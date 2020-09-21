import { readFileSync, existsSync } from 'fs';
import dotenv from 'dotenv';

const environment = process.env.NODE_ENV || 'dev';

const initializer = {};

initializer.run = () => {
  dotenv.config();
  const especiftEnvConfig = `.env.${environment}`;

  if (existsSync(especiftEnvConfig)) {
    const envConfig = dotenv.parse(readFileSync(especiftEnvConfig));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }
};

export default initializer;
