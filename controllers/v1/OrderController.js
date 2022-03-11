const { Order } = require("../../models/v1/Order");
require("dotenv").config();
const {
	successResponse,
	errorResponse,
} = require("../../utils/responseFormat");

const orderHistory = async (req, res) => {
	try {
		const user_id = req.user._id;
		const allItems = await Order.find({ user_id: user_id });
		return successResponse(req, res, allItems, "Order History.");
	} catch (e) {
		return errorResponse(req, res, e);
	}
};

const orderDetail = async (req, res) => {
	try {
		const order_id = req.params.id;
		const user_id = req.user._id;
		const allItems = await Order.findOne({ _id: order_id }).populate('items.product_id',"title");
		return successResponse(req, res, allItems, "Order Detail.");
	} catch (e) {
		return errorResponse(req, res, e);
	}
};

module.exports = { orderHistory, orderDetail };
