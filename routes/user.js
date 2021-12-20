var express = require('express');
var Router = express.Router();
var userController = require('../controllers/user_controller');
var upload = require('../helper/image_upload');

var router = function(){

    Router.get('/getusers', userController.getUsers);
    Router.get('/getuser', userController.getUser);

    Router.post('/updateuser', upload.upload.single('image'), userController.updateUser);

    return Router
}

module.exports = router();