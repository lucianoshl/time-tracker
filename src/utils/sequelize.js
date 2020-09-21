import { Sequelize, Model, DataTypes } from 'sequelize';
import configDir from './config_folder';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `${configDir}/${process.DATABASE}`
});

export default sequelize;