import {
  app, Menu, Tray, nativeImage,
} from 'electron';

import path from 'path';

import moment from 'moment';
import session from '../services/session';
import entryRegister from '../services/entry_register';
import connection from '../utils/sequelize';

let mainTick = null;
let tray = null;

let tracking = true;

const updateTray = async () => {
  const sumarized = await entryRegister.sumarize();
  const target = 1000 * 60 * 60 * 8 - sumarized;

  const time = moment().startOf('day').add(sumarized, 'milliseconds').format('HH:mm');

  const tail = moment().startOf('day').add(target, 'milliseconds').format('HH:mm');

  const finish = moment().add(target, 'milliseconds').format('HH:mm');

  const trackingMenu = {
    label: `Tracking: ${tracking}`,
  };

  trackingMenu.submenu = [
    {
      label: 'ON',
      click: () => {
        tracking = true;
        trackingMenu.label = `Tracking: ${tracking}`;
        mainTick({ tray });
      },
    },
    {
      label: 'OFF',
      click: () => {
        tracking = false;
        trackingMenu.label = `Tracking: ${tracking}`;
        mainTick({ tray });
      },
    },
  ];

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `Actual: ${time}` },
    { label: `Missing: ${tail}` },
    { label: `Finish in: ${finish}` },
    trackingMenu,
    {
      label: 'Exit',
      async click() {
        app.quit();
      },
    },
  ]));
};

mainTick = async (args) => {
  if (!tracking) return;

  const isLocked = session.isLocked();
  const event = isLocked ? entryRegister.register('LOCKED') : entryRegister.register('UNLOCKED');
  await updateTray({ ...args, event, tracking });
};

app.whenReady().then(async () => {
  await connection.sync({});

  const imageTray = nativeImage.createFromPath(path.join(__dirname, '../../icon.png'));
  tray = new Tray(imageTray.resize({ width: 16, height: 16 }));

  await entryRegister.register('APP_START');

  mainTick({ tray });
  setInterval(() => mainTick({ tray }), 1000 * 60);
});
