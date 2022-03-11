const { Category, validateAll } = require("../../models/v1/Category");
require("dotenv").config();
const {
	successResponse,
	errorResponse,
} = require("../../utils/responseFormat");

const addCategory = async (req, res) => {
	try {
		const { name } = req.body;
		let category = new Category({ name });
		result = await category.save();
		if (result) {
			return successResponse(req, res, result, "Category added successfully.");
		} else {
			return errorResponse(req, res, null);
		}
	} catch (e) {
		return errorResponse(req, res, null);
	}
};

const getAllCategories = async (req, res) => {
	try {
		const result = await Category.find({is_deleted:0});
		let retArray = [];
		if (!result) {
			return errorResponse(req, res, null, 'No Categories found.');
		}
		if (result.length > 0) {
			result.forEach((element) => {
				retArray.push({
					_id: element._id,
					name: element.name,
					slug: element.slug
				});
			});
		}
		return successResponse(req, res, retArray);
	} catch (e) {
		return errorResponse(req, res, null);
	}
};

module.exports = { addCategory, getAllCategories };
