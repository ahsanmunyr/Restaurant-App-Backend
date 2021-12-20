var express = require('express');
var Router = express.Router();
var superadminController = require('../controllers/superadmin_controller');

var router = function(){

    Router.get('/home', superadminController.home);
    Router.get('/getriders', superadminController.getRiders);
    Router.put('/togglerider', superadminController.toggleRider);

    return Router
}

module.exports = router();