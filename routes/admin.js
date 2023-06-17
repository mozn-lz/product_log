const router = require('express').Router();
const sequelize = require('../config/database');

// const { Product } = require('../models/product.model');

// Manage cars
router.get('/test', (req, res,) => { res.render('admin/cars', { title: 'Fairline Auto' }); });

/*************************************
	* DNT    db config pages   DNT    *
 *************************************/
router.get('/config', async (req, res) => {
	console.log('\n\nSync \n\n');

	sequelize.sync()
		.then(() => { console.log('ok'); res.sendStatus(200) })
		.catch(() => send(500));
});

router.get('/f-config', async (req, res) => {
	// force sync
	console.log('\n\nForce sync \n\n');

	sequelize.sync({ force: true })
		.then((msg) => { console.log('ok: ', msg); res.sendStatus(200) })
		.catch((msg) => send(500));
});

module.exports = router;
