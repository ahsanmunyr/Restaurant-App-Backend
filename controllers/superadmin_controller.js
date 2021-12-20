'user strict';
const sql = require('../connection');

exports.home = async (req, res) =>{

    try {
        var report = [];
        
        const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'];

        for (let index = 1; index <= 12; index++) {
            sql.query(`SELECT
            (SELECT count(restaurant_id) FROM restaurant 
            WHERE MONTH(restaurant.restaurant_created_at) = ${index}) as restaurant,
            (SELECT count(rider_id) FROM rider where MONTH(rider.rider_created_at) = ${index}) as rider,
            (SELECT count(user_id) FROM user where MONTH(user.user_created_at) = ${index}) as user,
            CASE WHEN (SELECT sum(order_price) FROM orders where MONTH(orders.order_created_at) = ${index})
            IS NULL THEN 0 ELSE
            (SELECT sum(order_price) FROM orders where MONTH(orders.order_created_at) = ${index}) END AS orders 
            FROM restaurant GROUP BY restaurant, rider, user, orders`, (error, result) =>{
                if (error) {
                    return res.send(error);
                }
                report.push(result[0]);
                
                const r = JSON.stringify(report);
                const total_sales = report.reduce((a, b) => a + b.orders, 0);
                const total_users = report.reduce((a, b) => a + b.user, 0);
                const total_riders = report.reduce((a, b) => a + b.rider, 0);
                const total_restaurants = report.reduce((a, b) => a + b.restaurant, 0);

                if (index == 12) {
                    return res.json({
                        status: true,
                        msg: 'Home data fetched successfully',
                        data: {
                            'graph': report,
                            'report':{
                                'total_users': total_users,
                                'total_riders': total_riders,
                                'total_sales': total_sales,
                                'total_restaurants': total_restaurants,
                            }
                        }
                    });
                }
            })
        }

        // sql.query(`SELECT MONTH(restaurant_created_at) 'month', COUNT(restaurant_id) 'total_restaurants' FROM restaurant GROUP BY MONTH(restaurant_created_at) `, (restaurantError, restaurantResult) =>{
        //     if (restaurantError) return res.send(restaurantError);

        //     const r = JSON.stringify(restaurantResult);
        //     let total_restaurants = (JSON.parse(r)).reduce((a, b) => a + b.total_restaurants, 0);

        //     sql.query(`SELECT MONTH(user_created_at) 'month', COUNT(user_id) 'total_users' FROM user GROUP BY MONTH(user_created_at)`, (userError, userResult) =>{
        //         if (userError) return res.send(userError);
    
        //         const r = JSON.stringify(userResult);
        //         let total_users = (JSON.parse(r)).reduce((a, b) => a + b.total_users, 0);
    
        //         sql.query(`SELECT MONTH(rider_created_at) 'month', COUNT(rider_id) 'total_riders' FROM rider GROUP BY MONTH(rider_created_at)`, (riderError, riderResult) =>{
        //             if (riderError) return res.send(riderError);
        
        //             const r = JSON.stringify(riderResult);
        //             let total_riders = (JSON.parse(r)).reduce((a, b) => a + b.total_riders, 0);

        //             sql.query(`SELECT MONTH(order_created_at) 'month', SUM(order_price) 'total_order_price' FROM orders GROUP BY MONTH(order_created_at)`, (orderError, orderResult) =>{
        //                 if (orderError) return res.send(orderError);
            
        //                 const {total_order_price} = orderResult[0];

        //                 const r = JSON.stringify(orderResult);
        //                 let total_sales = (JSON.parse(r)).reduce((a, b) => a + b.total_order_price, 0);
            
        //                 return res.json({
        //                     status: true,
        //                     msg: 'Users fetched successfully',
        //                     data: {
        //                         'graph': [
        //                             {
        //                                 'name':'Total restaurants',
        //                                 data: restaurantResult
        //                             },
        //                             {
        //                                 'name':'Total users',
        //                                 data: userResult
        //                             },
        //                             {
        //                                 'name':'Total riders',
        //                                 data: riderResult
        //                             },
        //                         ],
        //                         'monthly_sales':
        //                             {
        //                                 'name':'Total order price',
        //                                 data: orderResult
        //                             },
        //                         'report':{
        //                             'total_users': total_users,
        //                             'total_riders': total_riders,
        //                             'total_sales': total_sales,
        //                             'total_restaurants': total_restaurants,
        //                         }
                                
        //                 }
        //                 });
        //             });
        //         });
                
        //     })
            
        // })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}

exports.getRiders = async (req, res) =>{

    try {
        sql.query(`SELECT rider_id, rider_name, rider_email, rider_phone, rider_image, rider_license_image, rider_cnic_image_front, rider_cnic_image_back, rider_status, rider_online, rider_created_at FROM rider`, (err, result) =>{
            if (err) return res.send(err);
            
            return res.json({
                status: true,
                msg: 'Riders fetched successfully',
                data: result
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

exports.toggleRider = async (req, res) =>{

    try {
        const {rider_id} = req.query;

        sql.query(`SELECT rider_status FROM rider WHERE rider_id = ${rider_id}`, (err, result) =>{
            if (err) return res.send(err);
            
            const {rider_status} = result[0];
            let status = 1;
            let msg = 'Rider enabled successfully';

            if (rider_status == 1) {
                status = 0;
                msg = 'Rider disabled successfully';
            }

            sql.query(`UPDATE rider SET rider_status = ${status} WHERE rider_id = ${rider_id}`, (statusError, statusResult) =>{
                if (statusError) return res.send(statusError);

                return res.json({
                    status: true,
                    msg: msg,
                    data: {
                        rider_status: status
                    }
                })
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
