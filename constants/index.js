const path = require("path");
const uploadspath = path.join(__dirname, "/../public/uploads/")
const baseurl = 'http://localhost:4000/';
const uploadsurl = 'uploads/';
var config = {
    pagingLimitPerPage: 10,
    imagespath: uploadspath+'product-images/',
    imagesurl: baseurl+uploadsurl+'product-images/',
    s3BucketUrl : "https://ecomwebimages.s3.ap-south-1.amazonaws.com/"
}
module.exports = function(mode) {
	return config;
}   