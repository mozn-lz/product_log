const endpoint = "http://localhost:8080";

let show_alert = (success, display) => {
	success
		? $("#show_message").html(`
        <div class="alert alert-success" role="alert">
          ${display}
        </div>`).delay(3200).fadeOut(300)
		: $("#show_message").html(`
        <div class="alert alert-danger" role="alert">
          ${display}
        </div>`).delay(3200).fadeOut(300);
};

let selectedProduct = {};
// selectedProduct.id = 1 // toto: delete

let resetFields = () => {
	selectedProduct = null;
	$("#editProductModalLabel").html("");
	$("#updateRemainingModalLabel").html("");
	$("#name").val("");
	$("#category").val("");
	$("#shelf").val("");
	$("#remaining").val("");
	$("#watch_qty").val("");
	$("#pack_qty").val("");
	$("#cost").val("");
	$("#selling").val("");
	$("#priority").val("");
};
/**
 *
 * @param {OOK} path URL
 * @param {ARRAY} data RANDOM DATA
 * @returns SERVER RESPONSE
 */
let postReq = (path, data) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: endpoint + path,
			type: "POST",
			data,
			success: (res) => resolve(res),
			error: (e) => reject(e),
		});
	});
};
/**
 * SELECT PRODUCT
 *   FOR SELECTING products
 * @param {STRING} id id from
 */
let selectProduct = (id) => {
	console.log(endpoint + "/get-product/", id);
	postReq("/get-product/", { id })
		.then((res) => {
			console.log(res);
			if (res.success) {
				selectedProduct = res.data;
				console.log(res.data);

				$("#priceModalLabel").html(res.data.name);
				$("#editProductModalLabel").html(res.data.name);
				$("#updateRemainingModalLabel").html(res.data.name);
				$("#name").val(res.data.name);
				$("#category").val(res.data.category);
				$("#shelf").val(res.data.shelf);
				$("#remaining").val(res.data.remaining);
				$("#watch_qty").val(res.data.watch_qty);
				$("#pack_qty").val(res.data.pack_qty);
				$("#cost").val(res.data.cost);
				$("#selling").val(res.data.selling);
				$("#priority").val(res.data.priority);
				// resetFields()
			}
		})
		.catch((e) => {
			// send error message
			console.log("434");
		});
};
/**
 * UPDATE REMAINING
 */
let onUpdateQty = () => {
	const remaining = $("#remainingUpdate").val();

	console.warn("onUpdateQty", remaining);
	console.log("onUpdateQty", remaining);

	if (selectedProduct && selectedProduct.id && Number(remaining)) {
		postReq("/update-product/", {
			id: selectedProduct.id,
			remaining,
			qty: true,
		})
			.then((res) => {
				console.log(res);
				if (res.success) {
					console.log("OK");
					// todo: show pop-up success message
					$("#remainingUpdate").val("");
					resetFields();
          show_alert(true, 'Quantity updated');
				} else {
          console.log("Fail");
          show_alert(false, 'Failed to update');
				}
			})
			.catch((e) => {
        // todo : 'send error message'
        show_alert(false, 'Failed to update' + e);
				console.log("434");
			});
		console.log("good");
	} else {
    show_alert(false, 'input error: field might be inaccurate');
		console.warn("Product load error or remaining quantity error");
	}
};
/**
 * UPDATE PRODUCT INFO
 */
let onUpdateProduct = () => {
	let name = $("#name").val().trim();
	let category = $("#category").val().trim();
	let shelf = $("#shelf").val().trim();
	let remaining = $("#remaining").val().trim();
	let watch_qty = $("#watch_qty").val().trim();
	let pack_qty = $("#pack_qty").val().trim();
	let cost = $("#cost").val().trim();
	let selling = $("#selling").val().trim();
	let priority = $("#priority").val().trim();

	// todo: validate data
	if (name.length || category.length || shelf.length ||
		Number(remaining) || Number(watch_qty) || Number(pack_qty) ||
		Number(cost) || Number(selling) || Number(priority)) {
		console.log("update");

		const editProduct = {};
		validate_name(name) ? (editProduct.name = name) : "";
		validate_category(category) ? (editProduct.category = category) : "";
		validate_shelf(shelf) ? (editProduct.shelf = shelf) : "";
		validate_remaining(remaining) ? (editProduct.remaining = remaining) : "";
		validate_watch_qty(watch_qty) ? (editProduct.watch_qty = watch_qty) : "";
		validate_pack_qty(pack_qty) ? (editProduct.pack_qty = pack_qty) : "";
		validate_cost(cost) ? (editProduct.cost = cost) : "";
		validate_selling(selling) ? (editProduct.selling = selling) : "";
		validate_priority(priority) ? (editProduct.priority = priority) : "";

		// send request
		postReq("/update-product/", {
			id: selectedProduct.id,
			remaining,
			edit: true,
		})
			.then((res) => {
				// todo send success message to user
        show_alert(true, 'Update successful');
				resetFields();
			})
			.catch((e) => {
        // todo: error message to user
        show_alert(false, 'failed to update fields: ' + e);
			});
    } else {
      // if validation fails
      // todo: error message to user
      show_alert(false, 'Input error');
	}
};
/**
 * ADD NEW PRODUCT
 */
let onSaveNewProduct = () => {
	const product = {
		name: $("#Name").val().trim(),
		category: $("#Category").val().trim(),
		shelf: $("#Shelf").val().trim(),
		remaining: $("#Remaining").val().trim(),
		watch_qty: $("#Watch_qty").val().trim(),
		pack_qty: $("#Pack_qty").val().trim(),
		cost: $("#Cost").val().trim(),
		selling: $("#Selling").val().trim(),
		priority: $("#Priority").val().trim(),
		itemCode: $("#itemCode").val().trim(),
	};

	// todo: validate data
	if (
		product.name.length ||
		product.category.length ||
		product.shelf.length ||
		Number(product.remaining) ||
		Number(product.watch_qty) ||
		Number(product.pack_qty) ||
		Number(product.cost) ||
		Number(product.selling) ||
		Number(product.priority)
	) {
		console.log("qas");
		postReq("/update-product/", { product, newProduct: true })
			.then((res) => {
				console.log(res);
				// todo send success message to user
				// product saved
				// resetFields();
				$("#Name").val("");
				$("#Category").val("");
				$("#Shelf").val("");
				$("#Remaining").val("");
				$("#Watch_qty").val("");
				$("#Pack_qty").val("");
				$("#Cost").val("");
				$("#Selling").val("");
				$("#Priority").val("");
				$("#itemCode").val("");
				$("#newProductModalClose").click();
				show_alert(true, "Product saved");
			})
			.catch((e) => {
				// todo: error message to user
        show_alert(false, 'Failed to update fields');
				console.log(e);
			});
	} else {
		// if validation fails
		// todo: error message to user
		console.log("Name: ", product.name.length);
		console.log("Category: ", product.category.length);
		console.log("Shelf: ", product.shelf.length);
		console.log("Remaining: ", Number(product.remaining));
		console.log("Watch_qty: ", Number(product.watch_qty));
		console.log("Pack_qty: ", Number(product.pack_qty));
		console.log("Cost: ", Number(product.cost));
		console.log("Selling: ", Number(product.selling));
		console.log("Priority: ", Number(product.priority));

    show_alert(true, 'Input error');
		$("#newProductModalClose").click();
    console.warn("invalid data");
	}
};
/**
 * UPDATE PRICES
 */
let onPriceUpdate = () => {
	const cost = $("#product_cost");
	const selling = $("#product_selling");

	// validate cost & selling
	postReq("/update-product/", { id: selectedProduct.id, selling, cost, priceUpdate: true, })
		.then((res) => {
			if (res.success) {
				// send success message >>> product qty updated
        show_alert(true, 'prices updated successfully');
			} else {
        // server error saving product
        show_alert(false, 'Sucess from server, but request failed');
			}
		})
		.catch((e) => {
      // error from server
      show_alert(false, 'Error updating prices: \n'+ e);
		});

	// reset fields
	cost.val("");
	selling.val("");
};
