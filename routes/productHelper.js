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
validateNum = (num) => {
	num && num.length ? num = num.trim(): 0;
// TODO: delete testing "console.log"
	// console.log(`ValidateNum (${num}) :`);
	// console.log(Number(num));
	// console.log(!isNaN(num));
	// console.log(num.length);
	// console.log(Number(num) - Number(num) == 0);

	return (num && (Number(num) && !isNaN(num) && num.length &&  
		Number(num) - Number(num) == 0) ? true: false);
}
const editProduct = (req, res, id) => {
	const incoming = req.body.edit;
	console.log('====================================');
	console.log({body:incoming});
	// console.log('remaining ', !isNaN(incoming.remaining))
	// console.log('watch_qty ', !isNaN(incoming.watch_qty))
	// console.log('pack_qty ', !isNaN(incoming.pack_qty))
	console.log('cost ', validateNum(incoming.cost))
	console.log('selling ', validateNum(incoming.selling))
	// console.log('priority ', !isNaN(incoming.priority))
	// console.log('itemCode ', !isNaN(incoming.itemCode))
	console.log('====================================');
	Product.findByPk(id)
	.then((product) => {
		if (!product) {
			console.log({msg:`Product not found`});
			res.send({ success: false, data: null, msg: `Product not found` });
		} else {
			console.log('\n\n\t\t100 success\n\n');
			// console.log({product});
			const edit = {};
			product.name      != incoming.name			&& incoming.name							? (edit.name 			= incoming.name.trim())			: console.log('name failed');
			product.category  != incoming.category	&& incoming.category					? (edit.category	= incoming.category.trim())	: console.log('category failed');
			product.shelf     != incoming.shelf			&& incoming.shelf							? (edit.shelf			= incoming.shelf.trim())		: console.log('shelf failed');
			product.remaining != incoming.remaining	&& validateNum(incoming.remaining)	? (edit.remaining = incoming.remaining.trim()): console.log('remaining failed');
			product.watch_qty != incoming.watch_qty	&& validateNum(incoming.watch_qty)	? (edit.watch_qty = incoming.watch_qty.trim()): console.log('watch_qty failed');
			product.pack_qty  != incoming.pack_qty	&& validateNum(incoming.pack_qty)	? (edit.pack_qty  = incoming.pack_qty.trim()) : console.log('pack_qty failed');
			product.cost      != incoming.cost			&& validateNum(incoming.cost)			? (edit.cost      = incoming.cost.trim())     : console.log('cost failed' + !isNaN(incoming.cost));
			product.selling   != incoming.selling		&& validateNum(incoming.selling)		? (edit.selling   = incoming.selling.trim())  : console.log('selling failed' + !isNaN(incoming.selling));
			product.priority  != incoming.priority	&& validateNum(incoming.priority)	? (edit.priority  = incoming.priority.trim()) : console.log('priority failed' + !isNaN(incoming.priority));
			product.itemCode  != incoming.itemCode	&& validateNum(incoming.itemCode)	? (incoming.itemCode.trim())   : console.log('itemCode failed' + !isNaN(incoming.itemCode));
			// !isNaN(incoming.itemCode)  ? (edit.itemCode  = incoming.itemCode.trim())   : console.log('itemCode failed');
		
			if (edit.name ||edit.category ||edit.shelf ||edit.remaining ||
					edit.watch_qty ||edit.pack_qty ||edit.cost ||edit.selling ||edit.priority) {
				// update process
				console.log('====================================');
				console.log('Edit passed validation: ');
				console.log(edit);
				console.log('====================================');
				res.send({ success: true, data: edit });
				console.log('response sent: ' + { success: true, data: edit });
				// Product.update(edit, { where: { id } })
				// .then((result) => {
				//     res.send({ success: true, data: result });
				// 	})
				// 	.catch((err) => {
				// 		res.send({ success: false, msg: `Error updating product: ${err}` });
				// 	});
			} else {
				res.send({ success: false, data: null, msg: `No data found` });
			}
		}
	}).catch((err) => {
		console.log({err});
		res.send({ success: false, data: null, msg: `Product not found` });
	});
}

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
