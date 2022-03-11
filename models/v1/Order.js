const mongoose = require("mongoose");
const Joi = require("joi");
const orderSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
		},
		last_name: {
			type: String,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
		country: {
			type: String,
		},
		address_line_1: {
			type: String,
		},
		address_line_2: {
			type: String,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		postal_code: {
			type: String,
		},
		phone_number: {
			type: String,
		},
		notes: {
			type: String,
		},
		items: {
			type: [{
				product_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "product",
				},
				price: Number,
				quantity:Number,
				_id:false
			}]
		},
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{
		timestamps: true,
	}
);

orderSchema.methods.toJSON = function () {
	const order = this;
	const orderObject = order.toObject();
	return orderObject;
};
const Order = mongoose.model("order", orderSchema);

function validateOrder(data) {
	let resMsg = "";
	const firstNameSchema = Joi.object({
		first_name: Joi.string().required().messages({
			"string.empty": "Please enter first name",
			"any.required": "Please enter first name",
		}),
	}).options({ abortEarly: false });

	const lastNameSchema = Joi.object({
		last_name: Joi.string().required().messages({
			"string.empty": "Please enter last name",
			"any.required": "Please enter last name",
		}),
	}).options({ abortEarly: false });

	const emailSchema = Joi.object({
		email: Joi.string().required().email().messages({
			"string.empty": "Please enter email",
			"string.email": "Please enter valid email",
			"any.required": "Please enter email",
		}),
	}).options({ abortEarly: false });

	const countrySchema = Joi.object({
		country: Joi.string().required().messages({
			"string.empty": "Please enter country",
			"any.required": "Please enter country",
		}),
	}).options({ abortEarly: false });

	const citySchema = Joi.object({
		city: Joi.string().required().messages({
			"string.empty": "Please enter city",
			"any.required": "Please enter city",
		}),
	}).options({ abortEarly: false });

	const stateSchema = Joi.object({
		state: Joi.string().required().messages({
			"string.empty": "Please enter state",
			"any.required": "Please enter state",
		}),
	}).options({ abortEarly: false });

	const postalCodeSchema = Joi.object({
		postal_code: Joi.string().required().messages({
			"string.empty": "Please enter postal code",
			"any.required": "Please enter postal code",
		}),
	}).options({ abortEarly: false });

	const phoneNumberSchema = Joi.object({
		phone_number: Joi.string().required().messages({
			"string.empty": "Please enter phone number",
			"any.required": "Please enter phone number",
		}),
	}).options({ abortEarly: false });

	const addressLine1Schema = Joi.object({
		address_line_1: Joi.string().required().messages({
			"string.empty": "Please enter address line 1",
			"any.required": "Please enter address line 1",
		}),
	}).options({ abortEarly: false });

	const addressLine2Schema = Joi.object({
		address_line_2: Joi.string().required().messages({
			"string.empty": "Please enter address line 2",
			"any.required": "Please enter address line 2",
		}),
	}).options({ abortEarly: false });

	const { errorA } = firstNameSchema.validate({ first_name: data.first_name });
	if (errorA) {
		errorA.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorB } = lastNameSchema.validate({ last_name: data.last_name });
	if (errorB) {
		errorB.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorC } = emailSchema.validate({ email: data.email });
	if (errorC) {
		errorC.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorD } = countrySchema.validate({ country: data.country });
	if (errorD) {
		errorD.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorE } = citySchema.validate({ city: data.city });
	if (errorE) {
		errorE.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorF } = stateSchema.validate({ state: data.state });
	if (errorF) {
		errorF.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorG } = postalCodeSchema.validate({ postal_code: data.postal_code });
	if (errorG) {
		errorG.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorH } = phoneNumberSchema.validate({ phone_number: data.phone_number });
	if (errorH) {
		errorH.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorI } = addressLine1Schema.validate({ address_line_1: data.address_line_1 });
	if (errorI) {
		errorI.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	const { errorJ } = addressLine2Schema.validate({ address_line_2: data.address_line_2 });
	if (errorJ) {
		errorJ.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	return resMsg;
}

module.exports = { Order, validateOrder };
