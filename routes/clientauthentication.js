var express = require('express');
var Router = express.Router();
var clientAuthController = require('../controllers/client_auth_controller');

var router = function () {

    Router.post('/register', clientAuthController.register);
    Router.post('/login', clientAuthController.login);
    Router.post('/verify', clientAuthController.verify);

    return Router
}

module.exports = router();