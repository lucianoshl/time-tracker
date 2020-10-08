import moment from 'moment';
import { deepStrictEqual } from 'assert';
import models from '../src/models';
import entryRegister from '../src/services/entry_register';

describe('entryRegister', () => it('simple register', async () => {
  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  const baseDate = moment().set({ hour: 10, minutes: 0, seconds: 0 });
  await entryRegister.register('APP_START', baseDate.toDate());
  await entryRegister.register('UNLOCKED', baseDate.toDate());

  const lock01 = baseDate.set({ hour: 12 });
  await entryRegister.register('LOCKED', lock01.toDate());

  const unlock01 = baseDate.set({ hour: 14 });
  await entryRegister.register('UNLOCKED', unlock01.toDate());

  const lock02 = baseDate.set({ hour: 18 });
  await entryRegister.register('LOCKED', lock02.toDate());
  await entryRegister.register('APP_QUIT', lock02.toDate());

  const sumarize = await entryRegister.sumarize();

  deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '06:00');
}));

describe('entryRegister', () => it('simple register with tolerance', async () => {
  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  const baseDate = moment().set({ hour: 10, minutes: 0, seconds: 0 });
  await entryRegister.register('APP_START', baseDate.toDate());

  const lock01 = baseDate.set({ hour: 12 });
  await entryRegister.register('UNLOCKED', moment().set(lock01));
  await entryRegister.register('LOCKED', moment().set(lock01));
  await entryRegister.register('LOCKED', baseDate.set({ hour: 14 }));


  const unlock01 = baseDate.set({ hour: 14 });
  await entryRegister.register('UNLOCKED', unlock01.toDate());

  await entryRegister.register('LOCKED', baseDate.set({ hour: 16, minutes: 5 }).toDate());
  await entryRegister.register('UNLOCKED', baseDate.set({ hour: 16, minutes: 10 }).toDate());

  const lock02 = baseDate.set({ hour: 18, minutes: 0 });
  await entryRegister.register('LOCKED', lock02.toDate());
  await entryRegister.register('APP_QUIT', lock02.toDate());

  const sumarize = await entryRegister.sumarize();

  deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '06:00');
}));

describe('entryRegister', () => it('with app_close', async () => {
  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  const baseDate = moment().set({ hour: 10, minutes: 0, seconds: 0 });
  await entryRegister.register('APP_START', baseDate.toDate());
  await entryRegister.register('UNLOCKED', moment().set({ hour: 11, minutes: 0, seconds: 0 }).toDate());

  const sumarize = await entryRegister.sumarize();

  deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '01:00');
}));