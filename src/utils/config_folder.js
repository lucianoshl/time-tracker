import { homedir } from 'os';
import { existsSync, mkdirSync } from 'fs';

const configFolder = `${homedir}/.time-tracker`;

if (!existsSync(configFolder)) {
  mkdirSync(configFolder, { recursive: true });
}

export default configFolder;
