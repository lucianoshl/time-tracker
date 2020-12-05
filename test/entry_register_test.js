import moment from 'moment';
import { deepStrictEqual } from 'assert';
import models from '../src/models';
import entryRegister from '../src/services/entry_register';
import connection from '../src/utils/sequelize';

const hour = (h, m = 0, s = 0, dayOffset = 0) => moment().set({ hour: h, minutes: m, seconds: s }).add(dayOffset, 'days').toDate();

const registerInterval = async (start, end, dayOffset = 0) => {
  await entryRegister.register('LOCKED', hour(start, 0, 0, dayOffset));
  await entryRegister.register('UNLOCKED', hour(end, 0, 0, dayOffset));
}

describe('entryRegister', () => it('test groups', async () => {
  await connection.sync({});

  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  await registerInterval(1, 5)
  await registerInterval(22, 23)
  await registerInterval(1, 4, 1)

  const sumarize = await entryRegister.sumarize();

  deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '08:00');
}));

describe('entryRegister', () => it('test register interval', async () => {
  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  await registerInterval(8, 12)
  await registerInterval(14, 18)

  const sumarize = await entryRegister.sumarize();

  deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '08:00');
}));

describe('entryRegister', () => it('simple register with tolerance', async () => {
  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  await entryRegister.register('APP_START', hour(10));
  await entryRegister.register('UNLOCKED', hour(12));

  await entryRegister.register('LOCKED', hour(14));

  await entryRegister.register('UNLOCKED', hour(16));
  await entryRegister.register('LOCKED', hour(16, 5));
  await entryRegister.register('UNLOCKED', hour(18));

  const sumarize = await entryRegister.sumarize();

  deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '06:00');
}));