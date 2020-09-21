import moment from 'moment';
import { deepStrictEqual } from 'assert';
import models from '../src/models';
import entryRegister from '../src/services/entry_register';

describe('entryRegister', () => it('simple register', async () => {
  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  const baseDate = moment().set({ hour: 1, minutes: 0, seconds: 0 });
  await entryRegister.register('APP_START', baseDate.toDate());

  const lock01 = baseDate.add(10, 'minutes');
  await entryRegister.register('LOCK', lock01.toDate());

  const unlock01 = lock01.add(3, 'minutes');
  await entryRegister.register('UNLOCK', unlock01.toDate());

  const lock02 = unlock01.add(45, 'minutes');
  await entryRegister.register('LOCK', lock02.toDate());

  const unlock02 = lock02.add(10, 'minutes');
  await entryRegister.register('UNLOCK', unlock02.toDate());

  const lock3 = unlock02.add(5, 'minutes');
  await entryRegister.register('LOCK', lock3.toDate());

  const sumarize = await entryRegister.sumarize();

  deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '01:03');
}));

describe('entryRegister', () => it('simple register with balance', async () => {
  await models.Event.destroy({
    where: {},
    truncate: true,
  });

  const baseDate = moment().set({ hour: 1, minutes: 0, seconds: 0 });
  await entryRegister.register('APP_START', baseDate.toDate());

  const lock01 = baseDate.add(10, 'minutes');
  await entryRegister.register('LOCK', lock01.toDate());

  const unlock01 = lock01.add(5, 'minutes');
  await entryRegister.register('UNLOCK', unlock01.toDate());

  const lock02 = unlock01.add(45, 'minutes');
  await entryRegister.register('LOCK', lock02.toDate());

  const sumarize = await entryRegister.sumarize();

  const formated = moment().startOf('day').milliseconds(sumarize).format('HH:mm');

  deepStrictEqual(formated, '01:00');
}));
