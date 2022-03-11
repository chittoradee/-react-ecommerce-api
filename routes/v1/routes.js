const express = require("express");
const {
	signup,
	login,
	forgotpassword,
	resetpassword,
	logout,
} = require("../../controllers/v1/UserController.js");
const {
	updateProfile,
	changePassword
} = require("../../controllers/v1/GlobaluserController.js");
const {
	addCategory,
	getAllCategories,
} = require("../../controllers/v1/CategoryController.js");
const {
	addToCart,
	getCartItems,
	deleteCartItems,
	placeOrder,
	clearCartItems,
} = require("../../controllers/v1/CartController.js");
const {
	add,
	list,
	detail,
} = require("../../controllers/v1/ProductController.js");
const userAuth = require("../../middleware/auth");
const router = new express.Router();
const multer = require("multer");
const {
	orderHistory,
	orderDetail,
} = require("../../controllers/v1/OrderController.js");
// multer configurations
const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

const upload = multer({ storage, fileFilter });

// Routes ...

// user routes
router.post("/v1/users/login", login);
router.post("/v1/users/signup", signup);
router.post("/v1/users/forgotpassword", forgotpassword);
router.post("/v1/users/resetpassword", resetpassword);
router.get("/v1/users/logout", userAuth, logout);

router.post("/v1/category/add", addCategory);
router.get("/v1/category/list", getAllCategories);
router.get("/v1/product/list", list);
router.get("/v1/product/detail/:id", detail);

router.post(
	"/v1/product/add",
	upload.fields([
		{ name: "title" },
		{ name: "image" },
		{ name: "description" },
		{ name: "category_id" },
		{ name: "price" },
		{ name: "rating" },
	]),
	add
);
router.post("/v1/cart/add",userAuth, addToCart);
router.get("/v1/cart/list",userAuth, getCartItems);
router.post("/v1/cart/delete",userAuth, deleteCartItems);
router.post("/v1/cart/clear",userAuth, clearCartItems);
router.post("/v1/place-order",userAuth, placeOrder);
router.get("/v1/orders", userAuth, orderHistory);
router.get("/v1/orders/:id", userAuth, orderDetail);
router.post("/v1/users/updateprofile", userAuth, updateProfile);
router.post("/v1/users/change-password", userAuth, changePassword);
module.exports = router;