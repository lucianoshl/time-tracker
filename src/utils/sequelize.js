import { Sequelize } from 'sequelize';
import configFolder from './config_folder';

let storage = process.env.DATABASE || 'database.sqlite';

if (storage.indexOf('sqlite') !== -1) {
  storage = `${configFolder}/${storage}`;
}

const connection = new Sequelize({ dialect: 'sqlite', storage, logging: false });

export default connection;
