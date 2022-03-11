const { Cart, validateAll } = require("../../models/v1/Cart");
const { Order, validateOrder } = require("../../models/v1/Order");
require("dotenv").config();
const config = require("../../constants")();
const mongoose = require("mongoose");
const {
	successResponse,
	errorResponse,
} = require("../../utils/responseFormat");

const addToCart = async (req, res) => {
	try {	
		const { product_id, user_id } = req.body;
		const getItem = await Cart.findOne({user_id:user_id,product_id:product_id});
		let quantity;
		if(getItem){
			quantity = getItem.quantity+1;
			result = await Cart.updateOne({_id:getItem._id},{quantity:quantity});
		}else{
			quantity = 1;
			let cart = new Cart({ product_id, user_id, quantity });
			result = await cart.save();
		}
		if (result) {
			const allItems = await Cart.find({user_id:user_id}).populate('product_id');
			return successResponse(req, res, allItems, "Item added to cart.");
		} else {
			return errorResponse(req, res, null);
		}
	} catch (e) {
		console.log(e)
		return errorResponse(req, res, null);
	}
};

const deleteCartItems = async (req, res) => {
	try {
		const { id, user_id } = req.body;
		await Cart.deleteOne({_id:id});
		const allItems = await Cart.find({user_id:user_id}).populate('product_id');
		return successResponse(req, res, allItems, "Item removed from cart.");
	} catch (e) {
		console.log(e)
		return errorResponse(req, res, null);
	}
};

const getCartItems = async (req,res) => {
	try {
		const user_id = req.user._id;
		const allItems = await Cart.find({user_id:user_id}).populate('product_id');
		if (allItems.length > 0) {
			allItems.forEach((el) => {
				if (el.product_id.image !== "") {
					el.product_id.image = config.s3BucketUrl + el.product_id.image;
				} else {
					el.product_id.image = config.noimageurl;
				}
			});
		}
		return successResponse(req, res, allItems, "Items List.");
	} catch (e) {
		console.log(e)
		return errorResponse(req, res, null);
	}
}

const clearCartItems = async (req, res) => {
	try {
		const { user_id } = req.body;
		await Cart.deleteMany({user_id:user_id});
		return successResponse(req, res, null, "Item removed from cart.");
	} catch (e) {
		return errorResponse(req, res, null);
	}
};
const placeOrder = async (req, res) => {
	try {
		const resMsg = validateOrder(req.body);
		if (resMsg !== ""){
			return errorResponse(req, res, null, resMsg);
		}
		const { items, first_name, last_name, country, address_line_1, address_line_2, city, state, postal_code, phone_number, email, notes,user_id } = req.body;
		const itemsData = items.map((item,element) => {
			item.product_id = mongoose.Types.ObjectId(item.product_id)
			return item;
		});
		console.log(itemsData)
		const order = new Order({
			first_name,
			last_name,
			email,
			country,
			address_line_1,
			address_line_2,
			city,
			state,
			postal_code,
			phone_number,
			notes,
			user_id,
			items:itemsData
		});
		const result = await order.save();
		return successResponse(req, res, result, "Order placed successfully.");
	} catch (e) {
		console.log(e)
		return errorResponse(req, res, null);
	}	
};
module.exports = { addToCart, getCartItems, deleteCartItems, placeOrder, clearCartItems };