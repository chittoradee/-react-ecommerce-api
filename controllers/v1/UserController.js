const { User, validateAll } = require("../../models/v1/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
	successResponse,
	errorResponse,
} = require("../../utils/responseFormat");

//Login Api
const login = async (req, res) => {
	try {
		const resMsg = validateAll("login", req.body);
		if (resMsg !== ""){
			return errorResponse(req, res, null, resMsg);
		}
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user) {
			const password_matched = await bcryptjs.compare(password, user.password);
			if (!password_matched) {
				return errorResponse(req, res, null, "Invalid Credentials");
			} else {
				const token = jwt.sign(
					{ _id: user._id.toString() },
					process.env.JWT_KEY
				);
				const updatedUser = await User.findById(user._id).exec();
				const retValue = { token, updatedUser };
				return successResponse(req, res, retValue, "Login Successful");
			}
		} else {
			return errorResponse(req, res, null, "Invalid Credentials");
		}
	} catch (e) {
		return errorResponse(req, res, null);
	}
};

//Signup api
const signup = async (req, res) => {
	try {
		const resMsg = validateAll("signup", req.body);
		if (resMsg !== "") {
			return errorResponse(req, res, null, resMsg);
		}
		const { first_name, last_name, email, password } =
			req.body;
		const user = await User.findOne({ email });
		if (!user) {
			const hashedPassword = await bcryptjs.hash(password, 8);
			const user = new User({
				first_name,
				last_name,
				email,
				password: hashedPassword,
				user_role_id: 2
			});
			const result = await user.save();
			if (result) {
				const token = jwt.sign(
					{ _id: result._id.toString() },
					process.env.JWT_KEY
				);
				const retValue = { token, result };
				return successResponse(req, res, retValue, "Signup Successful");
			} else {
				return errorResponse(req, res, null);
			}
		} else {
			return errorResponse(req, res, null, "Email already exist");
		}
	} catch (e) {
		return errorResponse(req, res, null);
	}
};

const logout = async (req, res) => {
	try {
		const user = req.user;
		let result = await User.updateOne(
			{ _id: user._id },
			{ device_id: "", device_type: "" }
		);
		if (result.modifiedCount > 0) {
			return successResponse(req, res, {}, "Logged Out");
		} else {
			return errorResponse(req, res, null);
		}
	} catch (e) {
		return errorResponse(req, res, null);
	}
};

module.exports = { signup, login, logout };
