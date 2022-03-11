const mongoose = require("mongoose");
const Joi = require("joi");
var URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);
const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},

		slug: {
			type: String,
		},
		is_active: {
			type: Boolean,
			default: 1,
		},
		is_deleted: {
			type: Boolean,
			default: 0,
		},
		slug: { type: String, slug: "name" , unique:true },
	},
	{
		timestamps: true,
	}
);

categorySchema.methods.toJSON = function () {
	const category = this;
	const categoryObject = category.toObject();
	return categoryObject;
};
categorySchema.pre("save", function (next) {
	this.slug = this.name.split(" ").join("-");
	next();
});
const Category = mongoose.model("category", categorySchema);

function validateAll(data) {
	let resMsg = "";
	const nameSchema = Joi.object({
		name: Joi.string().required().messages({
			"string.empty": "Please enter category name",
			"any.required": "Please enter category name",
		}),
	}).options({ abortEarly: false });

	const { error } = nameSchema.validate({ name: data.name });
	if (error) {
		error.details.forEach((element) => {
			resMsg = resMsg + "  " + element.message;
		});
	}
	return resMsg;
}

module.exports = { Category, validateAll };
