import { Op } from 'sequelize';
import moment from 'moment';
import { vsprintf } from 'sprintf-js';
import models from '../models';

const { Event } = models;

const entryRegister = {};
const tolerance = 1000 * 60 * 10;

entryRegister.registerQuit = async () => {
  const lastEvent = await Event.findOne({
    order: [['createdAt', 'DESC']],
  });

  if (lastEvent) await entryRegister.register('APP_QUIT', lastEvent.ocurrence);
};

entryRegister.register = async (type, date = new Date()) => {
  const lastEvent = await Event.findOne({
    order: [['createdAt', 'DESC']],
  });

  if (lastEvent && type === lastEvent.type) {
    lastEvent.ocurrence = date;
    await lastEvent.save();
  } else {
    const result = await Event.create({ ocurrence: date, type });
    await result.save();
  }
};

entryRegister.sumarize = async () => {
  const registers = await Event.findAll({
    where: {
      ocurrence: {
        [Op.gt]: moment().startOf('day'),
        [Op.lt]: moment().endOf('day'),
      },
    },
    order: [['ocurrence', 'ASC']],
  });

  let result = 0;

  for (let i = 0; i < registers.length; i += 1) {
    const currentElement = registers[i];
    const nextElement = registers[i + 1];

    if (!nextElement) break;

    const diference = nextElement.ocurrence - currentElement.ocurrence;

    let elegible = false;

    elegible ||= currentElement.type === 'APP_START' && nextElement.type === 'UNLOCKED';

    elegible ||= currentElement.type === 'UNLOCKED' && nextElement.type === 'LOCKED' && (diference <= tolerance);

    elegible ||= currentElement.type === 'LOCKED' && nextElement.type === 'UNLOCKED';

    if (elegible) {
      result += diference;
    }

    console.log(vsprintf('%9s %9s %s %s %s %s', [
      currentElement.type,
      nextElement.type,
      moment(currentElement.ocurrence).local().format('HH:mm'),
      moment(nextElement.ocurrence).local().format('HH:mm'),
      moment().startOf('day').milliseconds(diference).format('HH:mm'),
      elegible,
    ]));
  }

  console.log('--');

  return result;
};

export default entryRegister;
