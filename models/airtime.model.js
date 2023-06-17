const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// airtime model
const Airtime = sequelize.define('airtime', {
	description: { type: DataTypes.STRING(255), allowNull: false },
	amount: { type: DataTypes.STRING(10), allowNull: false },
	date: { type: DataTypes.STRING(50), allowNull: false },
	balance: { type: DataTypes.STRING(10), allowNull: false }
});

airtimeSync = async () => {
	Airtime.sync({ force: true })
		.then(dt => dt)
		.catch(e => e);
}

module.exports = {
	Airtime,
	airtimeSync
}
