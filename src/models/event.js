const DataTypes = require('sequelize');

export default {
  type: {
    type: DataTypes.ENUM('APP_START', 'APP_QUIT', 'UNLOCK', 'LOCK'),
  },
  ocurrence: {
    type: DataTypes.DATE,
  },
};
