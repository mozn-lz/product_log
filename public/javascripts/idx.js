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
 * sends request to search products [name, category]
 */
const search = $('#search');
search.change(() => {
	console.log(search.val());
	// setTimeout(() => {
	// }, 1500);
	if (search.val().trim().length > 0) {
		console.log(search.val());
		postReq("/get-product/", { search: search.val() })
			.then((result) => {
				let display = [];
				if (result.success && result.data && result.data.length) {
					// display data
					console.log("!!!SUCCESS!!!");
					console.log(result.data);
					result.data.forEach(product => {
						console.log(product.name);
						display.push(`
						<div class="m-2 p-1 border border-1">
							<a href="#" onclick="selectProduct(${ product.id })" data-bs-toggle="modal" data-bs-target="#updateRemainingModal">
								<div class="name col-8 p-1">${ product.name }</div>
								<div class="options col-3">
									<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProductModal" onclick="selectProduct(${ product.id })">Edit</button>
									<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#priceModal" onclick="selectProduct(${ product.id })">Price</button>
								</div>
							</a>
						</div>`);
						// if (products && products.length)  {
						//   // products.forEach(product => {
						//   // });
						// } else {
						// }
					});
				} else {
					// no results output
					console.warn("\n\tresult err : ");
					console.warn(result);
					display.push(`<p class="h5 text-center">no products found</p><%`) 
				}
				$('#products').html(display);
			})
			.catch((err) => {
				// error message
				console.error("Failed to go to server: " + err);
			});
	}
	console.log("search: ", search.val());
});

/**
 * SELECT PRODUCT
 *   FOR SELECTING products
 * @param {STRING} id id from
 */
let selectProduct = (id) => {
	console.log(endpoint + "/get-product/", {id});
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
		$('#updateRemainingModal').modal('hide');
		postReq("/update-product/", {
			id: selectedProduct.id,
			edit: {remaining},
			qty: true,
		})
			.then((res) => {
				console.log(res);
				if (res.success) {
					// todo: show pop-up success message
					console.log("OK");
					show_alert(true, 'Quantity updated');

					// resetFields();
					$("#remainingUpdate").val('');
					selectProduct = null;
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
// validate_name = (name) => {return name ? true : false;}
// validate_category = (category) => {return category ? true : false;}
// validate_shelf = (shelf) => {return shelf ? true : false;}
// validate_remaining = (remaining) => {return remaining ? true : false;}
// validate_watch_qty = (watch_qty) => {return watch_qty ? true : false;}
// validate_pack_qty = (pack_qty) => {return pack_qty ? true : false;}
// validate_cost = (cost) => {return cost ? true : false;}
// validate_selling = (selling) => {return selling ? true : false;}
// validate_priority = (priority) => {return priority ? true : false;}
// validate_priority = (itemCode) => {return itemCode ? true : false;}

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
	let itemCode = $("#itemCode").val().trim();

	// todo: validate data
	if (name.length || category.length || shelf.length ||
		Number(remaining) || Number(watch_qty) || Number(pack_qty) ||
		Number(cost) || Number(selling) || Number(priority)) {
		console.log("update");

		const editProduct = {};
		(name.length)       ? (editProduct.name       = name)       : null;
		(category.length)   ? (editProduct.category   = category)   : null;
		(shelf.length)      ? (editProduct.shelf      = shelf)      : null;
		!isNaN(remaining)   ? (editProduct.remaining  = Number(remaining))  : null;
		!isNaN(watch_qty)   ? (editProduct.watch_qty  = Number(watch_qty))  : null;
		!isNaN(pack_qty)    ? (editProduct.pack_qty   = Number(pack_qty))   : null;
		!isNaN(cost)        ? (editProduct.cost       = Number(cost))       : null;
		!isNaN(selling)     ? (editProduct.selling    = Number(selling))    : null;
		!isNaN(priority)    ? (editProduct.priority   = Number(priority))   : null;
		!isNaN(itemCode)    ? (editProduct.itemCode   = Number(itemCode))   : null;

		// close modal
		$('#editProductModal').modal('hide');

		// send request
		postReq("/update-product/", {
			id: selectedProduct.id,
			edit: editProduct,
			updateProduct: true,
		})
			.then((res) => {
				// todo send success message to user
				show_alert(true, 'Update successful');

				// resetFields
				$("#name").val('');
				$("#category").val('');
				$("#shelf").val('');
				$("#remaining").val('');
				$("#watch_qty").val('');
				$("#pack_qty").val('');
				$("#cost").val('');
				$("#selling").val('');
				$("#priority").val('');
				$("#itemCode").val('');
				selectProduct = null;
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
}
/**
 * ADD NEW PRODUCT
 */
let onSaveNewProduct = () => {
	const newProduct = {
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
	if (newProduct.name.length || newProduct.category.length || newProduct.shelf.length ||
		Number(newProduct.remaining) || Number(newProduct.watch_qty) || Number(newProduct.pack_qty) ||
		Number(newProduct.cost) || Number(newProduct.selling) || Number(newProduct.priority)
	) {
		console.log("qas");
		postReq("/update-product/", { product: newProduct, newProduct: true })
		.then((res) => {
				console.log(res);
				// todo send success message to user
				// product saved
				show_alert(true, 'product saved');

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
				selectProduct = null;

				// close modal
				// $('#newProductModal').modal('hide');
				$("#newProductModalClose").click();
			})
			.catch((e) => {
				// todo: error message to user
				show_alert(false, 'Failed to update fields');
				console.log(e);
			});
	} else {
		// if validation fails
		// todo: error message to user
		console.log("Name: ", newProduct.name.length);
		console.log("Category: ", newProduct.category.length);
		console.log("Shelf: ", newProduct.shelf.length);
		console.log("Remaining: ", Number(newProduct.remaining));
		console.log("Watch_qty: ", Number(newProduct.watch_qty));
		console.log("Pack_qty: ", Number(newProduct.pack_qty));
		console.log("Cost: ", Number(newProduct.cost));
		console.log("Selling: ", Number(newProduct.selling));
		console.log("Priority: ", Number(newProduct.priority));

		show_alert(true, 'Input error');
		$("#newProductModalClose").click();
		console.warn("invalid data");
	}
};
/**
 * UPDATE PRICES
 */
let onPriceUpdate = () => {
	const cost = $("#product_cost").val();
	const selling = $("#product_selling").val();

	const edit = {cost, selling} 
	// validate cost & selling
	
	// hide modal
	$('#priceModal').modal('hide');
	postReq("/update-product/", { id: selectedProduct.id, edit, priceUpdate: true, })
		.then((res) => {
			if (res.success) {
				// send success message >>> product qty updated
				show_alert(true, 'prices updated successfully');

				// reset Form inputs
				$("#product_cost").val('');
				$("#product_selling").val('');
				selectProduct = null;
			} else {
				// server error saving product
				show_alert(false, 'Sucess from server, but request failed');
			}
		})
		.catch((e) => {
			// error from server
			show_alert(false, 'Error updating prices: \n'+ e);
		});
};
