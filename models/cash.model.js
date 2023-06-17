const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Cash model
const Cash = sequelize.define('cash', {
	description: { type: DataTypes.STRING(255), allowNull: false },
	amount: { type: DataTypes.STRING(10), allowNull: false },
	date: { type: DataTypes.STRING(50), allowNull: false },
	balance: { type: DataTypes.STRING(10), allowNull: false }
});

cashSync = async () => {
	Cash.sync({ force: true })
		.then(dt => dt)
		.catch(e => e);
}

module.exports = {
	Cash,
	cashSync
}
