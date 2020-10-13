import moment from 'moment';
import { deepStrictEqual } from 'assert';
import models from '../src/models';
import entryRegister from '../src/services/entry_register';

const hour = (h, m = 0, s = 0) => moment().set({ hour: h, minutes: m, seconds: s }).toDate();

// describe('entryRegister', () => it('simple register', async () => {
//   await models.Event.destroy({
//     where: {},
//     truncate: true,
//   });

//   const baseDate = moment().set({ hour: 10, minutes: 0, seconds: 0 });
//   await entryRegister.register('APP_START', baseDate.toDate());
//   await entryRegister.register('UNLOCKED', baseDate.toDate());

//   const lock01 = baseDate.set({ hour: 12 });
//   await entryRegister.register('LOCKED', lock01.toDate());

//   const unlock01 = baseDate.set({ hour: 14 });
//   await entryRegister.register('UNLOCKED', unlock01.toDate());

//   const lock02 = baseDate.set({ hour: 18 });
//   await entryRegister.register('LOCKED', lock02.toDate());
//   await entryRegister.register('APP_QUIT', lock02.toDate());

//   const sumarize = await entryRegister.sumarize();

//   deepStrictEqual(moment.utc(sumarize).format('HH:mm'), '06:00');
// }));

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