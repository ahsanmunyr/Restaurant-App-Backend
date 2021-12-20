'user strict';
const sql = require('../connection');

exports.searchItem = async (req, res) =>{

    try {
        let  { name, price, location, category } = req.query;

        name = '%' + name.trim() + '%'
        location = '%' + location.trim() + '%'
        price = '%' + price.trim() + '%'
        category = '%' + category.trim() + '%'

        //Searching against name, category and location only, price will be done afterwards
        sql.query(`SELECT i.* FROM item as i 
                LEFT JOIN restaurant as r ON i.restaurant_id = r.restaurant_id
                WHERE i.item_name LIKE ? AND r.restaurant_address LIKE ? AND r.category_id LIKE ?`, [ name, location, category ], (err, result) =>{
            if (err) return res.send(err);
            
            if (result.length > 0) {
                return res.json({
                    status: true,
                    msg: 'Items fetched successfully',
                    data: result
                })
            }

            return res.json({
                status: true,
                msg: 'No record found'
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

exports.searchRestaurantByLocation = async (req, res) =>{

    try {
        let { location} = req.query;

        location = '%' + location.trim() + '%';
        sql.query(`SELECT restaurant.*, count(review.review_id) as totat_reviews, review.rating 
                FROM restaurant LEFT JOIN review ON review.restaurant_id = restaurant.restaurant_id 
                WHERE restaurant.restaurant_address LIKE ?
                GROUP BY restaurant.restaurant_id`, [ location ], (err, result) =>{
            if (err) return res.send(err);
            
            if (result.length > 0) {
                return res.json({
                    status: true,
                    msg: 'Restaurants fetched successfully',
                    data: result
                })
            }

            return res.json({
                status: true,
                msg: 'No record found'
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

exports.searchRestaurantByRating = async (req, res) =>{

    try {
        let { rating } = req.query;

        sql.query(`SELECT restaurant.*, count(review.review_id) as totat_reviews, review.rating 
                FROM restaurant LEFT JOIN review ON review.restaurant_id = restaurant.restaurant_id 
                WHERE review.rating >= ?
                GROUP BY restaurant.restaurant_id`, [ rating ], (err, result) =>{
            if (err) return res.send(err);
            
            if (result.length > 0) {
                return res.json({
                    status: true,
                    msg: 'Restaurants fetched successfully',
                    data: result
                })
            }

            return res.json({
                status: true,
                msg: 'No record found'
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