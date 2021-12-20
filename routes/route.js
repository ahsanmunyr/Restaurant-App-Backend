const express = require('express');
const app = express();

var userRoute = require('./user');
var restaurantRoute = require('./restaurant');
var itemRoute = require('./item');
var categoryRoute = require('./category');
var reviewRoute = require('./review');
var ordersRoute = require('./orders');
var searchRoute = require('./search');
var dealRoute = require('./deal');
var paymentRoute = require('./payment');
var superadminRoute = require('./superadmin');

app.use('/user', userRoute);
app.use('/restaurant', restaurantRoute);
app.use('/item', itemRoute);
app.use('/category', categoryRoute);
app.use('/review', reviewRoute);
app.use('/orders', ordersRoute);
app.use('/search', searchRoute);
app.use('/deal', dealRoute);
app.use('/payment', paymentRoute);
app.use('/superadmin', superadminRoute);

module.exports = app;