import { platform } from 'os';
import { execSync } from 'child_process';

const LINUX = {
  isLocked: () => {
    const process = execSync('ps -ef | grep kscreenlocker | wc -l');
    return process === '2';
  },
};

const strategies = { LINUX };

const session = strategies[platform()];

export default session;
