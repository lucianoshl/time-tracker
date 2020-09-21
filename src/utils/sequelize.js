import { Sequelize } from 'sequelize';
import configFolder from './config_folder';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${configFolder}/${process.DATABASE}`,
});

export default sequelize;
