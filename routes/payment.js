var express = require('express');
var Router = express.Router();
var paymentController = require('../controllers/payment_controller');

var router = function(){

    Router.post('/pay', paymentController.pay);

    return Router
}

module.exports = router();