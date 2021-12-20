const mysql = require('mysql');

const connection = mysql.createConnection({
    host            :   'webprojectmockup',
    user            :   'webprojectmockup_restaurant_app',
    password        :   'g26JfoZB7=o1',
    database        :   'webprojectmockup_restaurantapp_db'
});

connection.connect((err) =>{
    if(err) console.log(`Database connection failed ${err}`);
    else console.log('Database connection successful');
});

module.exports = connection;