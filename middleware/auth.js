require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../models/v1/User");
const { errorResponse } = require("../utils/responseFormat");

const userAuth = async (req, res, next) => {
	try {
		if (!req.header("Authorization")) {
			return errorResponse(req, res, null, 'authorized');
		}
		const token = req.header("Authorization").replace("Bearer ", "");
		const tokenPayload = jsonwebtoken.verify(token, process.env.JWT_KEY);
		const user = await User.findById(tokenPayload._id);

		if (!user) {
			return errorResponse(req, res, null, 'Invalid User');
		}
		req.token = token;
		req.user = user;
		next();
	} catch (e) {
		return errorResponse(req, res, null);
	}
};

module.exports = userAuth;
