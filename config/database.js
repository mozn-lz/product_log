const { Sequelize } = require('sequelize');

// Connect to database
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mariadb'
});

// Database connectoin status
sequelize.authenticate()
.then (() => console.log('Connected to database'))
.catch(err => console.error(process.env, '\n\n*********\n* Fuck! *\n*********\n Can not connect to database: ', err));

module.exports = sequelize;
