const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// gas model
const Gas = sequelize.define('gas', {
	description: { type: DataTypes.STRING(255), allowNull: false },
	amount: { type: DataTypes.STRING(10), allowNull: false },
	date: { type: DataTypes.STRING(50), allowNull: false },
	balance: { type: DataTypes.STRING(10), allowNull: false }
});

gasSync = async () => {
	Gas.sync({ force: true })
		.then(dt => dt)
		.catch(e => e);
}

module.exports = {
	Gas,
	gasSync
}
