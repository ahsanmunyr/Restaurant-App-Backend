var FCM = require('fcm-node');
var serverKey = 'AAAAlEft19s:APA91bGQLu2sdYYJrXdwCL_zWe9ZwpJH24Ryr1_0SloCg0gQvJEWP-vJF96XQuOL5VpoV28RScMcjz775ilVCovN7i7EelKrelRc-9rUzmO-S3HX19H76KHGEyfvFwfETCoqyFXn_mJg';
var fcm = new FCM(serverKey);

const sendNotification = function(body, userId, payload){

    var message = {
            
        to: `/topics/${userId}`,
        //to: `/topics/RestaurantApp`, //for testing
        //collapse_key: 'your_collapse_key',
        
        notification: {
            title: 'Restaurant app', 
            body: body 
        },
        
        data: payload
    };

    const promise = new Promise((resolve, reject)=>{

        fcm.send(message, (err, response) =>{
            if (err) {
                reject(err)
            } else {
               resolve(response)
            }
        });
    })

    return promise;
}

module.exports = {
    sendNotification
};