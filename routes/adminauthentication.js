var express = require('express');
var Router = express.Router();
var adminAuthController = require('../controllers/admin_auth_controller');

var router = function () {

    Router.post('/login', adminAuthController.login);

    return Router
}

module.exports = router();