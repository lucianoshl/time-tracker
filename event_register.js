
const moment = require('moment');
const editJsonFile = require("edit-json-file");

const register = {};

let file = editJsonFile(`${__dirname}/content.json`);

const writeEntry = (type,lastItem) => {
  const list = register.getList();
  if (lastItem && lastItem.type === type){
    lastItem.time = new Date().getTime()
  } else {
    list.push({ type: 0, time: new Date().getTime() })
    list.push({ type, time: new Date().getTime() })
  }

  file.save();
};

const registerEntry = (type) => {
  const lastItem = register.getList().slice(-1)[0];
  writeEntry(type,lastItem)
};

register.getList = () => {
  const today = moment().format("DD/MM/YYYY");
  if (!file.get(today)){
    file.set(today,[]);
  }
  file.save();
  return file.get(today);
}

register.isLocked = () => { registerEntry(0) };

register.inUnlocked = () => { registerEntry(1) };

module.exports = register;