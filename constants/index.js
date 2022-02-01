const path = require("path");
const uploadspath = path.join(__dirname, "/../public/uploads/")
const baseurl = 'http://localhost:4000/';
const uploadsurl = 'uploads/';
var config = {
    pagingLimitPerPage: 10,
    imagespath: uploadspath+'images/',
    imagesurl: baseurl+uploadsurl+'images/',
    userpath: uploadspath+'users/',
    userurl: baseurl+uploadsurl+'users/',
    noimageurl: baseurl+uploadsurl+'no_image.png'
}
module.exports = function(mode) {
	return config;
}   