'user strict';
const sql = require('../connection');

const { sendNotification } = require('../helper/SendNotification');
var FCM = require('fcm-node');
var serverKey = 'AAAAePGgVsQ:APA91bFGrQmlE-ZnYudHLx6d2dUT03qi05XSKGLTzKM6H3LifWCF3Hzk77u18zURD54-HeLap2_b4AHnGkJqay59xL2SVmD-bRNMDalxCS29WynvbKFCjbphjL-N2sJwY77hUprXAo4F';
var fcm = new FCM(serverKey);

// Customer creating order
exports.createOrder = async (req, res) =>{

    try {
        const { user_id, restaurant_id, order_remarks, order_payment_method, order_price, order_location, order_latitude, order_longitude, items } = req.body;

        /* Creating order record in order table, order item and also updating order_status to 2 for 
        pending status until it is assigned to any rider */  

        sql.beginTransaction((transactionError)=>{
            if(transactionError) return res.send(transactionError);

            sql.query(`SELECT user_status FROM user WHERE user_id = ${user_id}`, (userErr, userResult) =>{
                if (userErr){
                    sql.rollback(() => {
                        return res.json({
                            status: false,
                            msg: userErr,
                        });
                    });
                }else{
                    const {user_status} = userResult[0];
                    console.log(user_status);
                    if (user_status == 0) {
                        //user is free means no order is in pending
                        sql.query(`INSERT INTO orders(user_id, restaurant_id, order_remarks, order_payment_method, order_price, order_location, order_latitude, order_longitude, order_status) 
                        VALUES(?,?,?,?,?,?,?,?,?)`, [user_id, restaurant_id, order_remarks, order_payment_method, order_price, order_location, order_latitude, order_longitude, 2], (err, result) =>{
                                
                            if (err){
                                sql.rollback(() => {
                                    return res.json({
                                        status: false,
                                        msg: err,
                                    });
                                });
                            } else{
                                sql.query(`INSERT INTO order_item(order_id, items) VALUES(?,?)`, [result.insertId, JSON.stringify(items)], (itemErr, itemResult) =>{
                                    if (itemErr){
                                        sql.rollback(() => {
                                            return res.json({
                                                status: false,
                                                msg: itemErr,
                                            });
                                        });
                                    }else{

                                        //changing user status to 1 that is busy so that user could not create any other order
                                        sql.query(`UPDATE user SET user_status = 1 WHERE user_id = ${user_id}`, (userErr, userResult) =>{
                                            if (userErr){
                                                sql.rollback(() => {
                                                    return res.json({
                                                        status: false,
                                                        msg: userErr,
                                                    });
                                                });
                                            } else{

                                                //Sending notification to user
                                                sendNotification('Your order has been placed', user_id, {'rolde-id':itemResult.insertId, 'type':'createorder'})
                                                .then((response)=>{
                                                    console.log('Notification sent');
                            
                                                    sql.commit((commitErr) =>{
                                                        if(commitErr){
                                                            sql.rollback(()=> {
                                                                return res.json({
                                                                    status: false,
                                                                    msg: "Order creation failed, try again",
                                                                });
                                                            });
                                                        } else{
                                                            return res.json({
                                                                status: true,
                                                                msg: 'Order created placed',
                                                                data: {
                                                                    order_id: result.insertId
                                                                },
                                                            });
                                                        }
                                                    });
                            
                                                }).catch((e) =>{
                                                    console.log('Notification not sent ', e);
                                                    sql.rollback(()=> {
                                                        return res.json({
                                                            status: false,
                                                            msg: 'Something went wrong',
                                                        });
                                                    });
                                                })
                                            }
                                        })
                                    }
                                });
                            }
                        });

                    }else{
                        //user is busy means currently is in pending
                        sql.commit((commitErr) =>{
                            if(commitErr){
                                sql.rollback(()=> {
                                    return res.json({
                                        status: false,
                                        msg: "Order creation failed, try again",
                                    });
                                });
                            } else{
                                return res.json({
                                    status: false,
                                    msg: 'Previous order need to be completed for new order',
                                });
                            }
                        });
                    }
                }
            })
        });
    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }
}

// Admin approving order
exports.approveOrder = async (req, res) =>{

    try {
        const {order_id, user_id} = req.query;
        
        /* Approving order and updating order status to 6 which refers to approved order status */ 
     
        sql.query('UPDATE orders SET order_status = ? WHERE order_id = ?',[ 6, order_id ], (err, result) =>{
            if (err) return res.send(err);

            //sending notifiation to user
            sendNotification('Your order has been approved by admin', user_id, {order_id, 'type':'approveorder'})
            .then((response)=>{
                console.log('Notification sent to customer');
                return res.json({
                    status: true,
                    msg: 'Order approved successfully',
                    data: {
                        order_status: 6
                    }
                });
            }).catch((e)=>{
                console.log('Notification not sent ', e);
                return res.json({
                    status: false,
                    msg: 'Something went wrong',
                });
            })

            //sending notifiation to all riders
            sql.query(`SELECT rider_id FROM rider`, (riderError, riderResult) =>{
                if (riderError) return res.send(riderError);
                
                riderResult.forEach(rider => {
                    //send notification to only those rider which are free
                    if (rider.order_id != 0) {
                        sendNotification('You have got new order', `rider${rider.rider_id}`, {order_id, 'type':'getorder'})
                        .then((response)=>{
                            console.log('Notification sent to rider ', rider.rider_id);
                        }).catch((e)=>{
                            console.log('Notification not sent ', e);
                        })
                    }
                });
            })
            
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}

// Admin rejecting order
exports.rejectOrder = async (req, res) =>{

    try {

        const {order_id, user_id} = req.query;

        /* Rejecting order and updating order status to 5 which referes to reject status */ 

        sql.beginTransaction((transactionError) =>{
            if(transactionError) return res.send(transactionError);

            sql.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [ 5, order_id ], (err, result) =>{
                if (err){
                    sql.rollback(() =>{
                        return res.send(err);
                    });
                }
    
                sendNotification('Your order has been rejected by admin', user_id, {order_id, 'type':'rejectorder'})
                .then((response)=>{
                    console.log('Notification sent');

                    sql.commit((commitErr) =>{
                        if(commitErr){
                            sql.rollback(()=> {
                                return res.json({
                                    status: false,
                                    msg: "Order cancellation failed, try again",
                                });
                            });
                        } else{
                            return res.json({
                                status: true,
                                msg: 'Order rejected successfully',
                                data: {
                                    order_status: 5
                                }
                            });
                        }
                    });

                }).catch((e)=>{
                    console.log('Notification not sent ', e);

                    sql.rollback(()=>{
                        return res.json({
                            status: false,
                            msg: 'Something went wrong'
                        });
                    })
                })
            })

        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }
}

// Rider accepting order
exports.acceptOrder = async (req, res) =>{

    try {
        const {order_id, user_id, restaurant_id, rider_id} = req.query;
        
        sql.query(`SELECT assigned_to FROM orders WHERE order_id = '${order_id}'`, (orderError, orderResult) =>{
            if (orderError) return res.send(orderError);

            const order = orderResult[0];

            //order is assigned to any other rider
            if (order.assigned_to != 0) {
                return res.json({
                    status: false,
                    msg: 'Order is assigned to other rider'
                });
            }

            /* Accepting order and updating order status to 4 which referes to accpeted order status
            and updating assigned_to to rider_id   */ 
            sql.query(`UPDATE orders SET order_status = ${4}, assigned_to = ${rider_id} WHERE order_id = ${order_id}`, (err, result) =>{
                if (err) return res.send(err);

                //Updating rider order_id to make rider busy
                sql.query(`UPDATE rider SET order_id = ${order_id} WHERE rider_id = ${rider_id}`, (riderError, riderResult) =>{
                    if (riderError) return res.send(riderError);

                    sendNotification('Your order has been accepted by rider', user_id, {order_id, 'type':'acceptorder'})
                    .then((response)=>{
                        console.log('Notification sent to users');
                    }).catch((e)=>{
                        console.log('Notification not sent ', e);
                    });

                    sendNotification('Your order has been accpeted by rider', restaurant_id, {order_id, 'type':'acceptorder'})
                    .then((response)=>{
                        console.log('Notification sent to restaurant');
                        return res.json({
                            status: true,
                            msg: 'Order accepted successfully',
                            data: {
                                order_status: 4
                            }
                        });
                    }).catch((e)=>{
                        console.log('Notification not sent ', e);
                        return res.json({
                            status: false,
                            msg: 'Something went wrong'
                        });
                    });
                });
            });
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

// Rider declining order
exports.declineOrder = async (req, res) =>{

    try {
        const {order_id, user_id} = req.query;
        
        /* Delining  order and updating order status to 3 which referes to declined order status */ 
     
        sql.query(`UPDATE orders SET order_status = ${3} WHERE order_id = ${order_id}`, (err, result) =>{
            if (err) return res.send(err);

            sendNotification('Your order has been declined by rider', user_id, {order_id, 'type':'declineorder'})
            .then((response)=>{
                console.log('Notification sent');
                return res.json({
                    status: true,
                    msg: 'Order declined successfully',
                    data: {
                        order_status: 3
                    }
                });
            }).catch((e)=>{
                console.log('Notification not sent ', e);
                return res.json({
                    status: false,
                    msg: 'Something went wrong'
                });
            })
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

// Rider starting ride
exports.startRide = async (req, res) =>{

    try {
        const {order_id, user_id, restaurant_id} = req.query;
        
        /* Starting ride and updating order status to 7 which referes to rider starting the ride */ 
        sql.query(`UPDATE orders SET order_status = ${7} WHERE order_id = ${order_id}`, (err, result) =>{
            if (err) return res.send(err);

            sendNotification('Rider has started the ride', restaurant_id, {order_id, 'type':'startride'})
            .then((response)=>{
                console.log('Notification sent to admin');
            }).catch((e)=>{
                console.log('Notification not sent ', e);
            });

            sendNotification('Rider has started the ride', user_id, {order_id, 'type':'startride'})
            .then((response)=>{
                console.log('Notification sent to user');
                return res.json({
                    status: true,
                    msg: 'Ride has started',
                    data: {
                        order_status: 7
                    }
                });
            }).catch((e)=>{
                console.log('Notification not sent ', e);
                return res.json({
                    status: false,
                    msg: 'Something went wrong'
                });
            });
        });

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

// Rider pickup order from restaurant
exports.pickupOrder = async (req, res) =>{

    try {
        const {order_id, user_id, restaurant_id} = req.query;
        
        /* Rider have picked up the order from restaurant now updating order status to 8 which referes 
        to rider have picked up the food from restaurant */
        sql.query(`UPDATE orders SET order_status = ${8} WHERE order_id = ${order_id}`, (err, result) =>{
            if (err) return res.send(err);

            sendNotification('Rider has picked up the food', restaurant_id, {order_id, 'type':'pickorder'})
            .then((response)=>{
                console.log('Notification sent to admin');
            }).catch((e)=>{
                console.log('Notification not sent ', e);
            });

            sendNotification('Rider has picked up the food', user_id, {order_id, 'type':'pickorder'})
            .then((response)=>{
                console.log('Notification sent to user');
                return res.json({
                    status: true,
                    msg: 'Rider has picked up the food',
                    data: {
                        order_status: 8
                    }
                });
            }).catch((e)=>{
                console.log('Notification not sent ', e);
                return res.json({
                    status: false,
                    msg: 'Something went wrong'
                });
            });
        });

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

// Rider arrival at customer
exports.arrived = async (req, res) =>{

    try {
        const {order_id, user_id, restaurant_id} = req.query;
        
        /* Rider have have arrived at customer's location now updating order status to 9 which referes 
        to rider have arrived at customer's place */
        sql.query(`UPDATE orders SET order_status = ${9} WHERE order_id = ${order_id}`, (err, result) =>{
            if (err) return res.send(err);

            sendNotification('Rider has arrived customers place', restaurant_id, {order_id, 'type':'arriveorder'})
            .then((response)=>{
                console.log('Notification sent to admin');
            }).catch((e)=>{
                console.log('Notification not sent ', e);
            });

            sendNotification('Rider has arrived', user_id, {order_id, 'type':'arriveorder'})
            .then((response)=>{
                console.log('Notification sent to user');
                return res.json({
                    status: true,
                    msg: 'Rider has arrived',
                    data: {
                        order_status: 9
                    }
                });
            }).catch((e)=>{
                console.log('Notification not sent ', e);
                return res.json({
                    status: false,
                    msg: 'Something went wrong'
                });
            });
        });

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

// Rider completing order
exports.completeOrder = async (req, res) =>{

    try {
        const {order_id, user_id, restaurant_id, rider_id} = req.query;
        
        /* Completing order and updating order status to 1 which referes to completed order status
        also updating assigned_to to 0 to make order free */ 
        sql.query(`UPDATE orders SET order_status = ${1}, assigned_to = ${0} WHERE order_id = ${order_id}`, (err, result) =>{
            if (err) return res.send(err);

            //Updating rider order_id to 0 to make rider free
            sql.query(`UPDATE rider SET order_id = ${0} WHERE rider_id = ${rider_id}`, (riderError, riderResult) =>{
                if (riderError) return res.send(riderError);

                sql.query(`UPDATE user SET user_status = ${0} WHERE user_id = ${user_id}`, (userError, userResult) =>{
                    if (userError) return res.send(userError);

                    sendNotification('Your order has been marked completed', restaurant_id, {order_id, 'type':'completeorder'})
                    .then((response)=>{
                        console.log('Notification sent to admin');
                    }).catch((e)=>{
                        console.log('Notification not sent ', e);
                    });

                    sendNotification('Your order has been completed', user_id, {order_id, 'type':'completeorder'})
                    .then((response)=>{
                        console.log('Notification sent to user');
                        return res.json({
                            status: true,
                            msg: 'Order is marked completed successfully',
                            data: {
                                order_status: 1
                            }
                        });
                    }).catch((e)=>{
                        console.log('Notification not sent ', e);
                        return res.json({
                            status: false,
                            msg: 'Something went wrong'
                        });
                    });
                });

            });
        });

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}
exports.getOrder = async (req, res) =>{

    try {
        const id = req.query.order_id;
        console.log(req.query)
        sql.query(`SELECT o.*, u.user_id, u.user_name, u.user_email, u.user_phone, u.user_image, 
                r.restaurant_name, r.restaurant_image, r.restaurant_address, r.restaurant_longitude, r.restaurant_latitude
                FROM orders as o
                LEFT JOIN user as u
                ON o.user_id = u.user_id      
                LEFT JOIN restaurant as r
                ON o.restaurant_id = r.restaurant_id
                WHERE o.order_id = ${id}`, (err, result) =>{
            if (err) return res.send(err);
            
            return res.json({
                status: true,
                msg: 'Order fetched successfully',
                data: result[0] //zero for single record
            });
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

exports.getOrders = async (req, res) =>{

    try {
        sql.query(`SELECT o.*, oi.*, r.restaurant_name FROM orders as o
                   INNER JOIN order_item as oi 
                   ON o.order_id = oi.order_id
                   LEFT JOIN restaurant as r 
                   ON o.restaurant_id = r.restaurant_id`, (err, result) =>{

            if (err) return res.send(err); 

            const data = result.map( item =>{
                return {...item, items:JSON.parse(item.items)}
            });

            return res.json({
                status: true,
                msg: 'Orders fetched successfully',
                data: data
            });
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

exports.getClientOrders = async (req, res) =>{

    try {
        const {user_id} = req.query;

        sql.query(`SELECT o.*, oi.* FROM orders as o 
            INNER JOIN order_item as oi
            ON o.order_id = oi.order_id
            WHERE o.order_is_deleted = ${0} AND user_id = ${user_id}`, (err, result) =>{
            if (err) return res.send(err);

                const data = result.map( item =>{
                    return {...item, items:JSON.parse(item.items)}
                })
            
                return res.json({
                    status: true,
                    msg: 'Orders fetched successfully',
                    data: data
                })
        })
    } catch (error) {
        console.log('Catch an error: ', error);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }
}

exports.getOrderDetails = async (req, res) =>{

    try {
        const rider_id = req.query.rider_id;
        sql.query(`SELECT r.rider_id, r.rider_name, r.rider_email, o.*, 
                res.restaurant_id, res.restaurant_name, res.restaurant_image, res.restaurant_address, res.restaurant_longitude, res.restaurant_latitude, res.restaurant_email, res.restaurant_phone
                FROM rider as r
                INNER JOIN orders as o
                ON r.order_id = o.order_id
                INNER JOIN restaurant as res
                ON o.restaurant_id = res.restaurant_id
                WHERE r.rider_id = ${rider_id}`, (err, result) =>{
            if (err) return res.send(err);
            
            console.log(result);

            if (result.length > 0) {
                //order assign hua wa hai
                return res.json({
                    status: true,
                    msg: 'Order details fetched successfully',
                    data: result[0] //zero for single record
                });
            }else{
                return res.json({
                    status: false,
                    msg: 'You have no order assigned yet',
                });
            }
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

exports.getClientOrderDetails = async (req, res) =>{

    try {
        const {user_id, order_id} = req.query;
        sql.query(`SELECT r.rider_id, r.rider_name, r.rider_email, o.*, 
                res.restaurant_id, res.restaurant_name, res.restaurant_image, 
                res.restaurant_address, res.restaurant_longitude, 
                res.restaurant_latitude, res.restaurant_email, res.restaurant_phone
                FROM orders as o
                INNER JOIN rider as r
                ON o.assigned_to = r.rider_id
                INNER JOIN restaurant as res
                ON o.restaurant_id = res.restaurant_id
                WHERE o.user_id = ${user_id}`, (err, result) =>{
            if (err) return res.send(err);
            
            console.log(result);

            if (result.length > 0) {

                const length = result.length; //this is for latest order

                //order assign hua wa hai
                return res.json({
                    status: true,
                    msg: 'Order details fetched successfully',
                    data: result[0] //zero for single record
                });
            }else{
                return res.json({
                    status: false,
                    msg: 'Your order is not assigned to any rider',
                });
            }
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}

exports.getUserOrderDetails = async (req, res) =>{

    try {
        const {user_id} = req.query;
        sql.query(`SELECT * FROM orders
                WHERE user_id = ${user_id}`, (err, result) =>{
            if (err) return res.send(err);
            
            console.log(result);

            if (result.length > 0) {

                const length = result.length; //this is for latest order

                //order assign hua wa hai
                return res.json({
                    status: true,
                    msg: 'Order details fetched successfully',
                    data: result[length - 1] //zero for single record
                });
            }else{
                return res.json({
                    status: false,
                    msg: 'No order found',
                });
            }
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        });
    }

}
