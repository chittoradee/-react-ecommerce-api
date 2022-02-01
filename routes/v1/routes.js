const express = require('express');
const { signup , login ,  logout } = require('../../controllers/v1/UserController.js');
const userAuth = require('../../middleware/auth');
const router = new express.Router();
//const multer = require('multer');
// multer configurations
//const storage = multer.memoryStorage();

/* const fileFilter = (req,file,callback)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    callback(null,true)
  }
  else{
    callback(null,false)
  }
} */

/* const upload = multer({ storage , fileFilter }); */

// Routes ...

// user routes
router.post('/v1/users/login', login);
router.post('/v1/users/signup', signup);
router.get('/v1/users/logout', userAuth, logout);

module.exports = router;