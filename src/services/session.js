import { platform } from 'os';
import { execSync } from 'child_process';

const linux = {
  isLocked: () => {
    const process = execSync('ps -ef | grep kscreenLOCKEDer | wc -l');
    return process.toString().trim() === '3';
  },
};

const strategies = { linux };

const session = strategies[platform()];

export default session;
