const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// paraffin model
const Paraffin = sequelize.define('paraffin', {
	description: { type: DataTypes.STRING(255), allowNull: false },
	amount: { type: DataTypes.STRING(10), allowNull: false },
	date: { type: DataTypes.STRING(50), allowNull: false },
	balance: { type: DataTypes.STRING(10), allowNull: false }
});

paraffinSync = async () => {
	Paraffin.sync({ force: true })
		.then(dt => dt)
		.catch(e => e);
}

module.exports = {
	Paraffin,
	paraffinSync
}
