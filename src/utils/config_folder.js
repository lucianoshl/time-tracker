import { homedir } from 'os';
import { existsSync, mkdirSync } from 'fs';

const config_folder = `${homedir}/.time-tracker`;

if (!existsSync(config_folder)) {
  mkdirSync(config_folder, { recursive: true });
}

export default config_folder;
