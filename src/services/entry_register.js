import { Op } from 'sequelize';
import moment from 'moment';
import models from '../models';

const { Event } = models;

const entryRegister = {};
const tolerance = 1000 * 60 * 5;

entryRegister.register = async (type, date) => {
  const lastEvent = await Event.findOne({
    order: [['ocurrence', 'DESC']],
  });

  if (lastEvent && lastEvent.type === type) {
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

  const toRemove = [];

  for (let i = 0; i < registers.length - 1; i += 1) {
    const currentElement = registers[i];
    const nextElement = registers[i + 1];

    const diference = nextElement.ocurrence - currentElement.ocurrence;

    if (currentElement.type === 'LOCK' && nextElement.type === 'UNLOCK' && diference <= tolerance) {
      toRemove.push(currentElement);
      toRemove.push(nextElement);
    }
  }

  const calcTarget = registers.filter((el) => !toRemove.includes(el)).reverse();

  let result = 0;
  for (let i = 0; i < calcTarget.length - 1; i += 2) {
    const currentElement = calcTarget[i];
    const nextElement = calcTarget[i + 1];

    result += currentElement.ocurrence - nextElement.ocurrence;
  }

  return result;
};

export default entryRegister;
