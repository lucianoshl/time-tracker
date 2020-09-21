const moment = require('moment');
const editJsonFile = require('edit-json-file');

const register = {};

const file = editJsonFile(`${__dirname}/content.json`);

const writeEntry = register.writeEntry = (type, lastItem) => {
  const list = register.getList();
  lastItem = lastItem || list.slice(-1)[0];

  if (!lastItem) {
    register.registerZero();
  } else if (lastItem.type === type) {
    lastItem.time = new Date().getTime();
    lastItem.label = moment().utc(lastItem.format('HH:mm'));
  } else {
    const item = { type, time: new Date().getTime() };
    item.label = moment().utc(lastItem.format('HH:mm'));
    list.push();
  }

  file.save();
};

const registerEntry = (type) => {
  const lastItem = register.getList().slice(-1)[0];
  writeEntry(type, lastItem);
};

register.registerZero = (externalList) => {
  const list = externalList || register.getList();
  list.push({ type: 0, time: new Date().getTime() });
  file.save();
};

register.getList = () => {
  const today = moment().format('DD/MM/YYYY');
  if (!file.get(today)) {
    file.set(today, []);
  }
  file.save();
  return file.get(today);
};

register.isLocked = () => { registerEntry(0); };

register.inUnlocked = () => { registerEntry(1); };

module.exports = register;
