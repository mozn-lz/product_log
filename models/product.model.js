const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// product model
const Product = sequelize.define("product", {
	description : { type: DataTypes.STRING(255), allowNull: true },
	date        : { type: DataTypes.STRING(50), allowNull: false },
	name        : { type: DataTypes.STRING(50), allowNull: false, unique: true },
	barcode     : { type: DataTypes.STRING(50), allowNull: true, unique: true },
	itemCode    : { type: DataTypes.STRING(50), allowNull: false, unique: true },
	category    : { type: DataTypes.STRING(50), allowNull: true },
	shelf       : { type: DataTypes.STRING(50), allowNull: true },
	remaining   : { type: DataTypes.INTEGER(8), allowNull: false },
	watch_qty   : { type: DataTypes.INTEGER(8), allowNull: false },
	pack_qty    : { type: DataTypes.INTEGER(3), allowNull: false },
	cost        : { type: DataTypes.DOUBLE(5,2), allowNull: false },
	selling     : { type: DataTypes.DOUBLE(5,2), allowNull: false },
	priority    : { type: DataTypes.INTEGER(1), allowNull: false },
	order_index : { type: DataTypes.INTEGER(1), allowNull: false, unique: true },
	active      : { type: DataTypes.BOOLEAN(i), allowNull: false },
  
});

productSync = async () => {
	Product.sync({ force: true })
		.then((dt) => dt)
		.catch((e) => e);
};
module.exports = {
	Product,
	productSync,
};
