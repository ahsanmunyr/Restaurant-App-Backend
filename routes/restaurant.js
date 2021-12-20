var express = require('express');
var Router = express.Router();
var restaurantController = require('../controllers/restaurant_controller');
var upload = require('../helper/image_upload');

var router = function(){

    //SuperAdmin
    Router.get('/getadminrestaurants', restaurantController.getAdminRestaurants);
    Router.get('/getadminrestaurant', restaurantController.getAdminRestaurant);
    Router.post('/createrestaurant', upload.upload.single('restaurant_image'), restaurantController.createRestaurant);
    Router.post('/updaterestaurant', upload.upload.single('restaurant_image'), restaurantController.updateRestaurant);
    Router.delete('/deleterestaurant', restaurantController.deleteRestaurant);

    //Client
    Router.get('/getuserrestaurants', restaurantController.getUserRestaurants);
    Router.get('/getuserrestaurant', restaurantController.getUserRestaurant);
    Router.get('/getrestaurantcategories', restaurantController.getRestaurantCategories);

    //Admin
    Router.post('/login', restaurantController.login);
    Router.get('/getrestaurant', restaurantController.getRestaurant);

    return Router
}

module.exports = router();