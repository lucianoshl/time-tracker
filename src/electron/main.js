import {
  app, Menu, Tray, nativeImage,
} from 'electron';

import path from 'path';

import moment from 'moment';
import session from '../services/session';
import entryRegister from '../services/entry_register';

let tray = null;

const updateTray = async () => {
  const sumarized = await entryRegister.sumarize();
  const target = 1000 * 60 * 60 * 8 - sumarized;

  const time = moment().startOf('day').add(sumarized, 'milliseconds').format('HH:mm:ss');

  const tail = moment().startOf('day').add(target, 'milliseconds').format('HH:mm:ss');

  const finish = moment().add(target, 'milliseconds').format('HH:mm:ss');

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `Actual: ${time}` },
    { label: `Missing: ${tail}` },
    { label: `Finish in: ${finish}` },
    {
      label: 'Exit',
      async click() {
        await entryRegister.registerQuit();
        app.quit();
      },
    },
  ]));
};

const mainTick = async (args) => {
  const isLoked = session.isLocked();
  const event = isLoked ? entryRegister.register('LOCKED') : entryRegister.register('UNLOCKED');
  await updateTray({ ...args, event });
};

app.whenReady().then(async () => {
  const imageTray = nativeImage.createFromPath(path.join(__dirname, '../../icon.png'));
  tray = new Tray(imageTray.resize({ width: 16, height: 16 }));

  await entryRegister.registerQuit();
  await entryRegister.register('APP_START');

  mainTick({ tray });
  setInterval(() => mainTick({ tray }), 1000 * 5);
});
