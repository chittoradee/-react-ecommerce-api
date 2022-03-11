const { User, validateAll, changePasswordValidate } = require("../../models/v1/User");
require("dotenv").config();
const config = require("../../constants")();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const {
	successResponse,
	errorResponse,
} = require("../../utils/responseFormat");

const updateProfile = async (req, res) => {
	try {
		const resMsg = validateAll("updateProfile", req.body);
		if (resMsg !== ""){
			return errorResponse(req, res, null, resMsg);
		}
		const { first_name, last_name, email } = req.body;
		const userID = req.user._id;
        const result = await User.updateOne({ _id : userID } , { first_name, last_name, email });
        if(result.modifiedCount > 0){
            const user = await User.findById(userID);
            return successResponse(req,res,user,'Profile updated successfully.');
        }else{
            return errorResponse(req, res, 'Email already exists');
        }
	} catch (e) {
		return errorResponse(req, res, null,'Email already exists');
	}
};

const changePassword = async (req,res) => {
    try{
        let user = req.user;
        const { old_password , new_password , confirm_password} = req.body;
        let errorString = '';
        const resMsg = changePasswordValidate( req.body);
        if (resMsg !== ''){
            errorString = errorString + resMsg;
        }
        if(new_password !== confirm_password || typeof confirm_password === "undefined"  ){
            errorString = errorString;
        }
        if(errorString !== ""){
            return errorResponse(req,res,null,errorString);
        }else{
            const password_matched = await bcryptjs.compare(old_password,user.password);
            if(!password_matched){
                return errorResponse(req,res,null,'Current Password is wrong.');
            }else{
                user.password = await bcryptjs.hash(new_password,8);
                const result = await user.save();
                return successResponse(req,res,result,'Password changed successfully.')
            }
        }
    }catch(e){
        return errorResponse(req,res,null);
    }
} 

module.exports = { updateProfile, changePassword };