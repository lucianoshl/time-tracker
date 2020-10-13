// import { platform } from 'os';
import { execSync } from 'child_process';

const exec = (command) => execSync(command).toString().trim();

const processRunning = (binName) => {
  try {
    exec(`pidof ${binName}`);
    return true;
  } catch (e) {
    return false;
  }
};

const i3 = {
  isLocked: () => processRunning('i3lock'),
};

// const kde = {
//   isLocked: () => processRunning('kscreenlocker'),
// };

// const strategies = { linux };

// const session = strategies[platform()];

export default (() => {
  if (processRunning('i3')) {
    return i3;
  }
  return undefined;
})();
