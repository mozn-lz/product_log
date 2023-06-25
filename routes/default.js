const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const { compare } = require("./helper");
const { Product } = require("../models/product.model");
const { User, createUser } = require("../models/stuff.model");
const { saveProduct, editProduct } = require("./productHelper");

// default pages
let products = [
	{
		id: 1,
		name: "CHAI 25KG",
		category: "FLOUR",
		shelf: "",
		wholesale: false,
		priority: 1,
		remaining: 35,
		watch_qty: 2,
		pack_qty: 1,
		cost: 138,
		selling: 150,
	},
	{
		id: 2,
		name: "CHAI 12.5KG",
		category: "FLOUR",
		shelf: "",
		wholesale: false,
		priority: 1,
		remaining: 45,
		watch_qty: 3,
		pack_qty: 1,
		cost: 46.65,
		selling: 110,
	},
	{
		id: 3,
		name: "CHAI 5KG",
		category: "FLOUR",
		shelf: "",
		wholesale: true,
		priority: 4,
		remaining: 10,
		watch_qty: 4,
		pack_qty: 4,
		cost: 42.68,
		selling: 54,
	},
	{
		id: 4,
		name: "ITAU WHITE MAZE MEAL 25KG",
		category: "FLOUR",
		shelf: "",
		wholesale: true,
		priority: 5,
		remaining: 3,
		watch_qty: 2,
		pack_qty: 1,
		cost: 185,
		selling: 223,
	},
	{
		id: 5,
		name: "ITAU YELLOW MAZE MEAL 12.5KG",
		category: "FLOUR",
		shelf: "",
		wholesale: false,
		priority: 3,
		remaining: 35,
		watch_qty: 4,
		pack_qty: 1,
		cost: 92.65,
		selling: 105,
	},
]; // const products = null;

router.get("/", async (req, res) => {
	Product.findAll()
	.then((products) => {
		res.render("index", { title: "Fairline Auto", products });
	}).catch((err) => {
		res.render("index", { title: "Fairline Auto", products: null });
	});
});

router.post("/get-product", async (req, res) => {
	const id				= req.body.id;
	const barCode		= req.body.barCode;
	const itemCode	= req.body.itemCode;
	const search		= req.body.search;
	console.log(req.body);

  // res.send('request received');
	if (id) {
		// findProductById(id)
		Product.findByPk(req.body.id)
			.then((product) => {
				product
					? res.send({ success: true, data: product })
					: res.send({ success: false, data: null });
			}).catch((err) => {
				res.send({ success: false, data: null });
			});
	} else if (itemCode) {
		Product.findOne({ where: { itemCode } })
			.then((product) => {
				product
					? res.send({ success: true, data: product })
					: res.send({ success: false, data: null });
			}).catch((err) => {
				res.send({ success: false });
			});
	} else if (barCode) {
		Product.findOne({ where: { barCode } })
			.then((product) => {
				product
					? res.send({ success: true, data: product })
					: res.send({ success: false, data: null });
			}).catch((err) => {
				res.send({ success: false });
			});
	} else if (search && search.length > 0) {
		Product.findAll({
			where: {
				[Op.or]: [
					{ name: { [Op.like]: `%${search}%` } },
					{ category: { [Op.like]: `%${search}%` } },
					{ shelf: { [Op.like]: `%${search}%` } },
				],
			},
		}).then((products) => {
				res.send({ data: products, success: true });
			}).catch((err) => {
				res.send({ success: false });
			});
	} else {
		Product.findAll()
			.then((result) => {
				res.send({ data: result, success: true });
			}).catch((err) => {
				res.send({ success: false, msg: err });
			});
	}
});
	
const log_remaining = async (req, id) => {
	const remaining = req.body.edit.remaining;

	const product = await Product.findByPk(id)
	if (product && remaining >= 0) {
		const entry = {
			product_id: product.id,
			itemCode: product.itemCode,
			date: new Date.now().toLocalDateString(),
			remaining,
			user_id: '1',
		}
		// Stock_taking_log.create()
		console.log(entry);
	} else {
		// log invalid input data
		console.log('log remaining: invalid data');
	}
}

router.post("/update-product", (req, res) => {
	const id = req.body.id;
	console.log('def: ',req.body);
	if (req.body.newProduct) {
		saveProduct(req, res);
	} else if (req.body.updateProduct && id) {
		console.log('edit');
		editProduct(req, res, id);
	} else if (req.body.priceUpdate && id) {
		console.log('upy');
		editProduct(req, res, id);
	} else if (req.body.qty && id) {
		console.log('qty');
		log_remaining(req, id)
		editProduct(req, res, id);
	} else {
		// default return error
		console.log('null');
		res.send({ success: false, data: null, msg: "err: no options selected" });
	}
});

router.post("/login", async (req, res) => {
	if (req.body.username && req.body.password) {
		User.findOne({where: {username: req.body.username.toLowerCase()}})
			.then((user) => {
				compare(user.password, req.body.password)
				.then((result) => {
					res.redirect('/');
				}).catch((err) => {
					res.send({success: false, msg: 'invalid login'});
				});
			}).catch((err) => {
				res.send({success: false, msg: 'invalid login'});
			});
	} else {
		res.sendStatus(404);
	}
});

router.post('/new-user', (req, res) => {
	let newUser = {};

	req.body.username.trim()	? newUser.username	= req.body.username.trim().toLowerCase()	: 0;
	req.body.password.trim()	? newUser.password	= req.body.password.trim()	              : 0;
	req.body.name.trim()			? newUser.name			= req.body.name.trim().toUpperCase()			: 0;
	req.body.email.trim()			? newUser.email			= req.body.email.trim()			              : 0;
	req.body.cell.trim()			? newUser.cell			= req.body.cell.trim()			              : 0;
	req.body.rights.trim()		? newUser.rights		= req.body.rights.trim()		              : 0;

	createUser(newUser)
		.then((result) => {
			res.send({ success: true, msg: `user '${newUser.name}' created successfully` });
		}).catch((err) => {
			res.send({ success: false, msg: `Failed to create user: ${err}` });
		});
});

router.get("/logout", (req, res) => {
	req.session = null;
	res.redirect("/login");
});

module.exports = router;
