var express = require('express');
var Router = express.Router();
var riderAuthController = require('../controllers/rider_auth_controller');
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
        riderAuthController.register);
    Router.post('/login', riderAuthController.login);
    Router.post('/verify', riderAuthController.verify);
    Router.post('/checkuser', riderAuthController.checkUser);
    Router.put('/online', riderAuthController.online);

    return Router
}

module.exports = router();