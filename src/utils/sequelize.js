import { Sequelize } from 'sequelize';
// import configFolder from './config_folder';

const connection = new Sequelize({
  dialect: 'sqlite',
  storage: `${process.env.DATABASE}`,
});

export default connection;
