import { platform } from 'os';
import { execSync } from 'child_process';

const linux = {
  isLocked: () => {
    // TODO: only KDE!
    const process = execSync('ps -ef | grep kscreenlocker | wc -l');
    return parseInt(process.toString().trim(), 10) > 2;
  },
};

const strategies = { linux };

const session = strategies[platform()];

export default session;
