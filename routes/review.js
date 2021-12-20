var express = require('express');
var Router = express.Router();
var reviewController = require('../controllers/review_controller');

var router = function(){

    Router.post('/createreview', reviewController.createReview);

    return Router
}

module.exports = router();