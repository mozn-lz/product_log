const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// user model
const User = sequelize.define('user', {
	username: { type: DataTypes.STRING(30), allowNull: false },
  password: { type: DataTypes.STRING(100), allowNull: false },
	name: { type: DataTypes.STRING(40), allowNull: false },
	email: { type: DataTypes.STRING(30) },
	cell: { type: DataTypes.STRING(13) },
	rights: { type: DataTypes.TEXT, defaultValue: 'user' },
	Services: { type: DataTypes.STRING, defaultValue: '0' },
	// reg: { type: DataTypes.STRING(30), defaultValue: new Date().toLocaleString() },
});

userSync = async () => {
	User.sync({ force: true })
		.then(dt => dt)
		.catch(e => {
			console.log(e);
			return console.log(e);
		});
}
let createUser = (new_user) => {
	return new Promise((res, rej) => {
		rej('fuck you')
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(new_user.password, salt, (err, hash) => {
				if (err) rej(err);
				new_user.password = hash;
				res(User.create(new_user));
			});
		});
	})
};

module.exports = getAllUsers = async () => {
	return await User.findAll();
};

module.exports = getUser = async obj => {
	return await User.findOne({ where: obj, });
};
module.exports = {
	User,
	userSync,
	createUser
}
