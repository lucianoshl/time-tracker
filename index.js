import {
  app, Menu, Tray, nativeImage,
} from 'electron';

import path from 'path';

import moment from 'moment';
import session from './src/services/session';
import entryRegister from './src/services/entry_register';

let tray = null;

const updateTray = () => {
  const sumarized = entryRegister.sumarize();
  const target = moment.utc(1000 * 60 * 60 * 8 - sumarized);

  const time = moment().startOf('day').milliseconds(sumarized).format('HH:mm');

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `Actual: ${time}` },
    { label: `Missing: ${target.format('HH:mm')}` },
    {
      label: 'Exit',
      click() {
        app.quit();
      },
    },
  ]));
};

const mainTick = (args) => {
  console.log('tick');
  const event = session.isLocked() ? entryRegister.register('LOCKED') : entryRegister.register('UNLOCK');
  updateTray({ ...args, event });
};

app.whenReady().then(() => {
  const imageTray = nativeImage.createFromPath(path.join(__dirname, '/icon.png'));
  tray = new Tray(imageTray.resize({ width: 16, height: 16 }));

  entryRegister.register('APP_START');

  mainTick({ tray });
  setInterval(() => mainTick({ tray }), 1000);
});
