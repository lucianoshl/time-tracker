const DataTypes = require('sequelize');

export default {
  type: {
    type: DataTypes.ENUM('UNLOCKED', 'LOCKED', 'APP_START', 'APP_QUIT'),
  },
  ocurrence: {
    type: DataTypes.DATE,
  },
};
