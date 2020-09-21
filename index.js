const {
  app, Menu, Tray, nativeImage,
} = require('electron');
// app.dock.hide();
// const { getSessionState } = require('macos-notification-state');
const path = require('path');
const moment = require('moment');
const register = require('./event_register');

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Exit',
    click() {
      app.quit();
    },
  },
]);

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
});

const updateTray = () => {
  const currentList = register.getList().slice();
  let calcList = [];
  let current;
  let startCount = false;

  while (current = currentList.shift()) {
    if (current.type == 0) {
      startCount = true;
    }

    if (startCount) {
      calcList.push(current);
    }
  }

  calcList = calcList.reverse();
  let sum = 0;

  for (let i = 0; i < calcList.length - 1; i += 2) {
    const currentElement = calcList[i];
    const nextElement = calcList[i + 1];

    sum += currentElement.time - nextElement.time;
  }

  const time = moment.utc(sum).format('HH:mm');

  tray.setToolTip(time);
  tray.setTitle(` ${time}`);

  const target = moment.utc(1000 * 60 * 60 * 8 - sum);

  contextMenu.items[0].label = time;

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
  console.log(moment('09-21-2020 09:30').toDate().getTime());
};

const mainTick = (args) => {
  // const state = getSessionState();
  // const locked = state === 'SESSION_SCREEN_IS_LOCKED';

  const { execSync } = require('child_process');
  const state = execSync('ps -ef | grep kscreenlocker | wc -l');

  const locked = state === '2';

  locked ? register.isLocked() : register.inUnlocked();
  updateTray(args);
};

let tray = null;
app.whenReady().then(() => {
  const imageTray = nativeImage.createFromPath(path.join(__dirname, '/icon.png'));
  imageTray.setTemplateImage(true);
  tray = new Tray(imageTray.resize({ width: 16, height: 16 }));
  tray.setContextMenu(contextMenu);

  register.writeEntry(0);

  mainTick({ tray });
  setInterval(() => mainTick({ tray }), 1000);
});
