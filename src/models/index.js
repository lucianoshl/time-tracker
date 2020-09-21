import connection from '../utils/sequelize';
import EventDefinition from './event';

const models = {};
models.Event = connection.define('Event', EventDefinition);

(async () => {
  await connection.sync();
})();

export default models;
