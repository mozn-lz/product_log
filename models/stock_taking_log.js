const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// stock_taking_log model
const Stock_taking_log = sequelize.define("stock_taking_log", {
	product_id  : { type: DataTypes.STRING(50), allowNull: false },
	itemCode    : { type: DataTypes.STRING(50), allowNull: false},
	date        : { type: DataTypes.STRING(50), allowNull: false },
	remaining   : { type: DataTypes.INTEGER(8), allowNull: false },
	user_id     : { type: DataTypes.INTEGER(8), allowNull: false },
});

stock_taking_logSync = async () => {
	Stock_taking_log.sync({ force: true })
		.then((dt) => dt)
		.catch((e) => e);
};
module.exports = {
	Stock_taking_log,
	stock_taking_logSync,
};
