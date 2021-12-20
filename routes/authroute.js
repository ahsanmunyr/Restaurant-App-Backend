var express = require('express');
var Router = express.Router();
var authController = require('../controllers/auth_controller');
var imageUpload = require('../helper/image_upload');

var router = function () {

    Router.post('/register', 
        imageUpload.upload.fields([{
            name: 'license_image', maxCount: 1
          }, {
            name: 'cnic_front', maxCount: 1
          },{
            name: 'cnic_back', maxCount: 1
          }]),
          authController.register);
    Router.post('/login', authController.login);
    Router.post('/verify', authController.verify);

    return Router;
}

module.exports = router();