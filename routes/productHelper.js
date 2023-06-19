const { Product } = require("../models/product.model");

const get_itemCode = (products) => {
	console.log('\n\nget_itemCode\n');
		if (products.length > 0) {
			for (let i = 0; i < products.length; i++) {
				const product = products[i];
				if (product.itemCode != i + 1) {
					return(i + 1);
				}
				if (i + 1 == products.length) {
					return(i + 2);
				}
			}
		} else {
			console.log("=> no codes, using 1");
			return(1);
		}
};

const get_orderIndex = (products) => {
	console.log('\n\nget_orderIndex\n');
	console.log('\n\nget_itemCode\n');
		if (products.length > 0) {
			for (let i = 0; i < products.length; i++) {
				const product = products[i];
				if (product.order_index != i + 1) {
					return(i + 1);
				}
				if (i + 1 == products.length) {
					return(i + 2);
				}
			}
		} else {
			console.log("=> no codes, using 1");
			return(1);
		}
};

const editProduct = (req, res, id) => {
	const edit = {};
	req.body.Name ? (edit.name = req.body.Name.trim()) : 0,
	req.body.Category ? (edit.category = req.body.Category.trim()) : 0,
	req.body.shelf ? (edit.shelf = req.body.Shelf.trim()) : 0,
	!isNaN(req.body.Remaining)	? (edit.remaining = req.body.Remaining.trim()) : 0,
	!isNaN(req.body.Watch_qty)	? (edit.watch_qty = req.body.Watch_qty.trim()) : 0,
	!isNaN(req.body.Pack_qty) ? (edit.pack_qty = req.body.Pack_qty.trim()) : 0,
	!isNaN(req.body.Cost) ? (edit.cost = req.body.Cost.trim()) : 0,
	!isNaN(req.body.Selling) ? (edit.selling = req.body.Selling.trim()) : 0,
	!isNaN(req.body.Priority) ? (edit.priority = req.body.Priority.trim()) : 0;

	if (edit.name ||edit.category ||edit.shelf ||edit.remaining ||
			edit.watch_qty ||edit.pack_qty ||edit.cost ||edit.selling ||edit.priority) {
		// update process
		Product.update(edit, { where: { id } })
			.then((result) => {
				res.send({ success: false, data: result });
			})
			.catch((err) => {
				res.send({ success: false, msg: `Error updating product: ${err}` });
			});
	} else {
		res.send({ success: false, data: null, msg: `err: no options selected` });
	}
	res.send("edit works");
};

const saveProduct = (req, res) => {
	console.log("saveProduct()");

	const product = req.body.product;
	// console.log(product);

	Product.findAll({ raw: true })
		.then(async (products) => {
			const newProduct = {
				name: product.name ? product.name.toUpperCase().trim() : null,
				category: product.category ? product.category.toUpperCase().trim() : null,
				shelf: product.shelf ? product.shelf.trim() : 1,
				remaining: product.remaining ? product.remaining.trim() : 0,
				watch_qty: product.watch_qty ? product.watch_qty.trim() : 3,
				pack_qty: product.pack_qty ? product.pack_qty.trim() : 1,
				cost: product.cost ? product.cost.trim() : "0.00",
				selling: product.selling ? product.selling.trim() : "0.00",
				barcode: product.barcode ? product.barcode : null,
				priority: product.priority ? product.priority.trim() : 5,
				date: new Date().toDateString(),
				description: product.description ? product.description : null,
				itemCode: await get_itemCode(products),
				order_index: await get_orderIndex(products),
				active: true,
			};

			console.log("newProduct: ", newProduct);

			if (newProduct.name &&newProduct.category &&(newProduct.shelf || 
				!isNaN(newProduct.shelf)) && !isNaN(newProduct.remaining) && 
				!isNaN(newProduct.watch_qty) && !isNaN(newProduct.pack_qty) && 
				!isNaN(newProduct.cost) && !isNaN(newProduct.selling) && 
				!isNaN(newProduct.priority) && !isNaN(newProduct.itemCode) && !isNaN(newProduct.order_index)) {
				// save proccess
				console.log("save");

				Product.create(newProduct)
					.then((result) => {
						console.log("saved successfully");
						res.send({ success: true });
					})
					.catch((err) => {
						console.log(`Error saving: ${err}`);
						res.send({ success: false, msg: `Error saving: ${err}` });
					});
			} else {
				// reject
				console.log("5. ====================================");
				console.log(
					"REJECT ",
					newProduct.name, "\n",
					newProduct.category, "\n",
					newProduct.shelf || !isNaN(newProduct.shelf),"\n",
					!isNaN(newProduct.remaining), "\n",
					!isNaN(newProduct.watch_qty), "\n",
					!isNaN(newProduct.pack_qty), "\n",
					!isNaN(newProduct.cost), "\n",
					!isNaN(newProduct.selling), "\n",
					!isNaN(newProduct.priority), "\n",
					!isNaN(newProduct.itemCode), '\n',
					!isNaN(newProduct.order_index));

				console.log("6 ====================================");

				res.send({
					success: false,
					data: null,
					msg: "err: no options selected",
				});
			}
		})
		.catch((err) => {
			console.log("Error:   ", err);
			res.send("new product works");
		});
};

exports.saveProduct = saveProduct;
exports.editProduct = editProduct;
