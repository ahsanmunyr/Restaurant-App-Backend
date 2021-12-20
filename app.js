const express = require('express');

const route = require('./routes/route');
const clientAuthRoute = require('./routes/clientauthentication');
const riderAuthRoute = require('./routes/riderauthentication');
var authorization = require('./helper/authorization');

const app = express();
var cors = require('cors');

app.use(cors());
app.options('*', cors());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

//route for authentication apis
app.use('/client', clientAuthRoute);
app.use('/rider', riderAuthRoute);

//route for authentication apis
// app.use('/api', authorization.checkToken, route); //token not checking during dev
app.use('/api', route);
  
const PORT = process.env.PORT || 9441;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));