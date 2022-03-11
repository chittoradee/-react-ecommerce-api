const mongoose = require("mongoose");
const Joi = require("joi");
const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},

		image: {
			type: String,
		},
		description: {
			type: String,
		},
		category_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "category",
		},
		price: {
			type: Number,
			default: 0,
		},
		rating: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

productSchema.methods.toJSON = function () {
	const product = this;
	const productObject = product.toObject();
	return productObject;
};
const Product = mongoose.model("product", productSchema);

function validateAll(data) {
	let resMsg = "";
	const titleSchema = Joi.object({
		title: Joi.string().required().messages({
			"string.empty": "Please enter product name",
			"any.required": "Please enter product name",
		}),
	}).options({ abortEarly: false });

	const categoryIdSchema = Joi.object({
		category_id: Joi.string().required().messages({
			"string.empty": "Please select category",
			"any.required": "Please select category",
		}),
	}).options({ abortEarly: false });

	const priceSchema = Joi.object({
		price: Joi.string().required().messages({
			"string.empty": "Please enter price",
			"any.required": "Please enter price",
		}),
	}).options({ abortEarly: false });

	const { error } = titleSchema.validate({ name: data.title });
	if (error) {
		error.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorA } = categoryIdSchema.validate({ name: data.category_id });
	if (errorA) {
		errorA.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorB } = priceSchema.validate({ name: data.price });
	if (errorB) {
		errorB.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	return resMsg;
}

module.exports = { Product, validateAll };
