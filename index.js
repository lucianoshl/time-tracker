const { app, Menu, Tray, nativeImage } = require('electron');
app.dock.hide();
const { getSessionState } = require('macos-notification-state');
const path = require('path');
const moment = require('moment');
const register = require("./event_register");


require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})

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

  for (var i = 0; i < calcList.length - 1; i += 2) {
    var currentElement = calcList[i];
    var nextElement = calcList[i + 1];

    sum += currentElement.time - nextElement.time;
  }

  tray.setTitle(` ${moment.utc(sum).format('HH:mm')}`);
};

const mainTick = (args) => {
  const state = getSessionState();
  const locked = state === 'SESSION_SCREEN_IS_LOCKED';

  locked ? register.isLocked() : register.inUnlocked();
  updateTray(args)
};



let tray = null
app.whenReady().then(() => {
  const imageTray = nativeImage.createFromPath(path.join(__dirname, "/icon.png"))
  imageTray.setTemplateImage(true)
  tray = new Tray(imageTray.resize({ width: 16, height: 16 }));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Exit',
      click() {
        app.quit()
      }
    }
  ]);
  tray.setContextMenu(contextMenu);

  register.writeEntry(0);

  mainTick({ tray })
  setInterval(() => mainTick({ tray }), 1000);

});