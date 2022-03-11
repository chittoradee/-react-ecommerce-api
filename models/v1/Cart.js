const mongoose = require("mongoose");
const Joi = require("joi");
const cartSchema = new mongoose.Schema(
	{
		product_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "product",
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		quantity: {
			type: Number,
			default: 1,
		},
	},
	{
		timestamps: true,
	}
);

cartSchema.methods.toJSON = function () {
	const cart = this;
	const cartObject = cart.toObject();
	return cartObject;
};
const Cart = mongoose.model("cart", cartSchema);

function validateAll(data) {
	let resMsg = "";
	const productIdSchema = Joi.object({
		product_id: Joi.string().required().messages({
			"string.empty": "product id is required.",
			"any.required": "product id is required.",
		}),
	}).options({ abortEarly: false });
	const userIdSchema = Joi.object({
		user_id: Joi.string().required().messages({
			"string.empty": "user id is required.",
			"any.required": "user id is required.",
		}),
	}).options({ abortEarly: false });
	const quantitySchema = Joi.object({
		quantity: Joi.string().required().messages({
			"string.empty": "Please enter quantity",
			"any.required": "Please enter quantity",
		}),
	}).options({ abortEarly: false });

	const { errorA } = productIdSchema.validate({ name: data.product_id });
	if (errorA) {
		errorA.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorC } = userIdSchema.validate({ name: data.user_id });
	if (errorC) {
		errorC.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorB } = quantitySchema.validate({ name: data.quantity });
	if (errorB) {
		errorB.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	return resMsg;
}

module.exports = { Cart, validateAll };
