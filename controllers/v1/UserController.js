const { User, validateAll, resetPasswordValidate } = require("../../models/v1/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
	successResponse,
	errorResponse,
} = require("../../utils/responseFormat");
const md5 = require('md5');
const emailHelper = require('../../utils/email');
const emailH = new emailHelper();

//Login Api
const login = async (req, res) => {
	try {
		const resMsg = validateAll("login", req.body);
		if (resMsg !== "") {
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
				const result = await User.findById(user._id).exec();
				const retValue = { token, result };
				return successResponse(req, res, retValue, "Login Successful");
			}
		} else {
			return errorResponse(req, res, null, "Invalid Credentials");
		}
	} catch (e) {
		return errorResponse(req, res, null);
	}
};
//forgotpassword Api
const forgotpassword = async (req, res) => {
	try {
		const resMsg = validateAll("forgotpassword", req.body);
		if (resMsg !== "") {
			return errorResponse(req, res, null, resMsg);
		}
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (user) {
			const validateString = md5(email);
			let result = await User.updateOne(
				{ _id: user._id },
				{ forgot_password_validate_string: validateString }
			);
			const resetPasswordLink = 'http://localhost:3000/reset-password/'+validateString
			const description = 'Hello '+user.first_name+',\n\n'+
				'Please open to below link in browser to reset password:'+'\n'+resetPasswordLink+'\n\n'+
				'Thanks.';
			await emailH.sendmail(email,'Reset Password',description);
			return successResponse(
				req,
				res,
				null,
				"Reset password email has been sent to your registered email address."
			);
		} else {
			return errorResponse(req, res, null, "Invalid Email Address");
		}
	} catch (e) {
		return errorResponse(req, res, null);
	}
};
//resetpassword Api
const resetpassword = async (req, res) => {
	try {
		const resMsg = resetPasswordValidate(req.body);
		console.log(resMsg)
		if (resMsg !== "") {
			return errorResponse(req, res, null, resMsg);
		}
		const { validate_string, new_password, confirm_password } = req.body;
		const hashedPassword = await bcryptjs.hash(new_password, 8);
		const user = await User.findOne({ forgot_password_validate_string : validate_string });
		if (user) {
			let result = await User.updateOne(
				{ _id: user._id },
				{ password: hashedPassword }
			);
			return successResponse(
				req,
				res,
				null,
				"Password reset successfully."
			);
		} else {
			return errorResponse(req, res, null, "Invalid Link");
		}
	} catch (e) {
		console.log(e)
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
		const { first_name, last_name, email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			const hashedPassword = await bcryptjs.hash(password, 8);
			const user = new User({
				first_name,
				last_name,
				email,
				password: hashedPassword,
				user_role_id: 2,
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

module.exports = { signup, login, forgotpassword,resetpassword, logout };
