const { Product } = require("../models/product.model");

const editProduct = (req, res, id) => {
	const edit = {};
  req.body.Name         			? edit.name				= req.body.Name.trim() : 0,
  req.body.Category   				? edit.category		= req.body.Category.trim() : 0,
  req.body.shelf      				? edit.shelf			= req.body.Shelf.trim() : 0,
  !isNaN(req.body.Remaining)  ? edit.remaining	= req.body.Remaining.trim() : 0,
  !isNaN(req.body.Watch_qty)  ? edit.watch_qty	= req.body.Watch_qty.trim() : 0,
  !isNaN(req.body.Pack_qty)   ? edit.pack_qty		= req.body.Pack_qty.trim() : 0,
  !isNaN(req.body.Cost)       ? edit.cost				= req.body.Cost.trim() : 0,
  !isNaN(req.body.Selling)    ? edit.selling		= req.body.Selling.trim() : 0,
  !isNaN(req.body.Priority)   ? edit.priority 	= req.body.Priority.trim() : 0;

  if (edit.name || edit.category || edit.shelf || edit.remaining ||
		edit.watch_qty || edit.pack_qty || edit.cost || edit.selling || edit.priority) {
		// update process
    Product.update(edit, { where: {id} })
      .then((result) => {
        res.send({ success: false, data: result });
      }).catch((err) => {
        res.send({ success: false, msg: `Error updating product: ${err}` });
      });
	} else {
		res.send({ success: false, data: null, msg: `err: no options selected` });
	}
	res.send("edit works");
};
exports.editProduct = editProduct;

const saveProduct = (req, res) => {
	console.log('saveProduct()');

	const product = req.body.product;
	console.log(product);

	Product.findAll()
	.then((products) => {
		console.log('1. ====================================');
		console.log('2> itemCode: ', itemCode, product.itemCode);
		if (product.itemCode) {
			console.log('T');
		} else {
			console.log('F');
		}
		

		
		console.log(product.itemCode, Number(products[products.length-1].itemCode), '\n: ++' + Number(products[products.length-1].itemCode)++);
		console.log(product.order_index, Number(products[products.length-1].order_index), '\n: ++' + Number(products[products.length-1].order_index)++);
		console.log('2. ====================================');
		
		const newProduct = {
			name			: product.name			? product.name.toUpperCase().trim()			: null,
			category	: product.category	? product.category.toUpperCase().trim()	: null,
			shelf			: product.shelf			? product.shelf.trim()			: 1,
			remaining	: product.remaining	? product.remaining.trim()	: 0,
			watch_qty	: product.watch_qty	? product.watch_qty.trim()	: 3,
			pack_qty	: product.pack_qty	? product.pack_qty.trim()		: 1,
			cost			: product.cost			? product.cost.trim()				: '0.00',
			selling		: product.selling		? product.selling.trim()		: '0.00',
			barcode		:	product.barcode		? product.barcode						: null,
			priority	: product.priority	? product.priority.trim()		: 5,
			date 			: new Date().toDateString(),
			description : product.description ? product.description		: null,
			itemCode	:	products	? Number(products[products.length-1].itemCode)++		: 1,
			order_index : products ? Number(products[products.length-1].order_index)++	: 1,
      active    : true 
			// date 			: product.date 			? product.date							: new Date().toDateString(),
		};
		
		console.log(product.itemCode, Number(products[products.length-1].itemCode), '\n: ++' + Number(products[products.length-1].itemCode)++);
		console.log(product.order_index, Number(products[products.length-1].order_index), '\n: ++' + Number(products[products.length-1].order_index)++);

		console.log('\nnewProduct: ', newProduct);
		console.log('3. ====================================>>');
		console.log('NewProduct REJECT \n')
		console.log('0itemCode: ' + !isNaN(newProduct.itemCode));
		console.log('1name: ' + newProduct.name);
		console.log('2category: ' + newProduct.category);
		console.log('3SHELF: ' + (newProduct.shelf || !isNaN(newProduct.shelf)));
		console.log('4remaining: ' + !isNaN(newProduct.remaining));
		console.log('5watch_qty: ' + !isNaN(newProduct.watch_qty));
		console.log('6pack_qty: ' + !isNaN(newProduct.pack_qty));
		console.log('7cost: ' + !isNaN(newProduct.cost));
		console.log('8selling: ' + !isNaN(newProduct.selling));
		console.log('9priority: ' + !isNaN(newProduct.priority));
		
		console.log('4. ====================================??');

		if (newProduct.name && newProduct.category && (newProduct.shelf || !isNaN(newProduct.shelf)) &&
			!isNaN(newProduct.remaining) && !isNaN(newProduct.watch_qty) &&
			!isNaN(newProduct.pack_qty) && !isNaN(newProduct.cost) &&
			!isNaN(newProduct.selling) && !isNaN(newProduct.priority) && !isNaN(newProduct.itemCode)) {
			// save proccess
			console.log('save');
			
			console.log('5. ====================================');
			Product.create(newProduct)
			.then(result => {
					console.log('saved successfully');
					res.send({ success: true });
				}).catch(err => {
					console.log(`Error saving: ${err}`);
					res.send({ success: false, msg: `Error saving: ${err}` });
				});
				console.log('6. ====================================');
		} else {
			// reject
			console.log('5. ====================================');

			console.log('REJECT ', newProduct.name, '\n',
				newProduct.category, '\n',
				(newProduct.shelf || !isNaN(newProduct.shelf)), '\n',
				!isNaN(newProduct.remaining), '\n',
				!isNaN(newProduct.watch_qty) ,'\n',
				!isNaN(newProduct.pack_qty), '\n',
				!isNaN(newProduct.cost) ,'\n',
				!isNaN(newProduct.selling), '\n',
				!isNaN(newProduct.priority), '\n',!isNan(newProduct.itemCode));

			console.log('6 ====================================');

			res.send({ success: false, data: null, msg: "err: no options selected" });
		}
	}).catch((err) => {
		res.send("new product works");
	});
		
		
};
exports.saveProduct = saveProduct;
