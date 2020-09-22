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

  const time = moment().startOf('day').add(sumarized, 'milliseconds').format('HH:mm');

  const tail = moment().startOf('day').add(target, 'milliseconds').format('HH:mm');

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `Actual: ${time}` },
    { label: `Missing: ${tail}` },
    {
      label: 'Exit',
      click() {
        app.quit();
      },
    },
  ]));
};

const mainTick = async (args) => {
  const isLocked = session.isLocked();
  console.log(new Date(), isLocked);
  const event = isLocked ? entryRegister.register('LOCKED') : entryRegister.register('UNLOCK');
  await updateTray({ ...args, event });
};

app.whenReady().then(() => {
  const imageTray = nativeImage.createFromPath(path.join(__dirname, '../../icon.png'));
  tray = new Tray(imageTray.resize({ width: 16, height: 16 }));

  entryRegister.register('APP_START');

  mainTick({ tray });
  setInterval(() => mainTick({ tray }), 1000);
});
