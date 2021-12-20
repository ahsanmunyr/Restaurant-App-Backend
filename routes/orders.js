var express = require('express');
var Router = express.Router();
var ordersController = require('../controllers/orders_controller');

var router = function(){

    //Customer
    Router.post('/create', ordersController.createOrder);
    // Router.post('/status', ordersController.createOrder);
    Router.get('/getclientorderdetails', ordersController.getClientOrderDetails);
    Router.get('/getuserorderdetails', ordersController.getUserOrderDetails);
    
    //Admin
    Router.get('/approve', ordersController.approveOrder);
    Router.get('/reject', ordersController.rejectOrder);

    //Rider
    Router.get('/accept', ordersController.acceptOrder);
    Router.get('/reject', ordersController.declineOrder);
    Router.get('/complete', ordersController.completeOrder);
    Router.get('/getorderdetails', ordersController.getOrderDetails);
    Router.get('/start', ordersController.startRide);
    Router.get('/pickup', ordersController.pickupOrder);
    Router.get('/arrived', ordersController.arrived);

    //  --
    Router.get('/getorder', ordersController.getOrder);
    Router.get('/getorders', ordersController.getOrders);
    Router.get('/getclientorders', ordersController.getClientOrders);



    return Router
}

module.exports = router();