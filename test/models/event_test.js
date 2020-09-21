import { deepStrictEqual } from 'assert';

import models from '../../src/models';

const { Event } = models;

describe('eventModel', () => it('save item', async () => {
  const event = await Event.create({ ocurrence: new Date(), type: 'APP_START' });
  const query = await Event.findOne({ type: 'APP_START' });

  deepStrictEqual(query.id, event.id);
}));
