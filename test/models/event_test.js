import { deepStrictEqual } from 'assert';

import models from '../../src/models';

const { Event } = models;

describe('eventModel', () => it('save item', async () => {
  const event = await Event.create({ ocurrence: new Date(), type: 'USER_IN' });
  const query = await Event.findOne({ type: 'USER_IN' });

  deepStrictEqual(query.id, event.id);
}));
