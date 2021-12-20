var express = require('express');
var Router = express.Router();
var dealController = require('../controllers/deal_controller');
var upload = require('../helper/image_upload');

var router = function(){

    //Admin
    Router.post('/create', upload.upload.single('deal_image'), dealController.createDeal);
    Router.post('/update', upload.upload.single('deal_image'), dealController.updateDeal);
    Router.delete('/delete', dealController.deleteDeal);
    Router.get('/getdeal', dealController.getDeal);
    Router.get('/getdeals', dealController.getDeals);

    //Client
    Router.get('/getclientdeals', dealController.getClientDeals);

    return Router
}

module.exports = router();