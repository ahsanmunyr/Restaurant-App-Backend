'user strict';
const sql = require('../connection');
const moment = require('moment');

exports.createDeal = async (req, res) =>{

    try {
        const { deal_title, deal_description, deal_expiry_date, deal_price, deal_items, restaurant_id} = req.body;
        const file = req.file //deal_image

        sql.query(`INSERT INTO deal(deal_title, deal_description, deal_price, deal_expiry_date, deal_items, deal_image, restaurant_id) 
                   VALUES(?,?,?,?,?,?,?)`, 
                   [ deal_title, deal_description, deal_price, deal_expiry_date, deal_items, file.path, restaurant_id ] , (err, result) =>{

                if (err) return res.send(err);

                return res.json({
                    status: true,
                    msg: 'Deal created successfully'
                })
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong',
            data: []
        }) 
    }

}

exports.updateDeal = async (req, res) =>{

    try {
        const { deal_title, deal_description, deal_price, deal_expiry_date, deal_items, restaurant_id, deal_id } = req.body;
        const file = req.file;//deal_image

        let query = `UPDATE deal SET deal_title = ?, deal_description = ?, deal_price = ?, deal_expiry_date = ?, deal_items = ?, restaurant_id = ? WHERE deal_id = ?`
        let queryValues = [ deal_title, deal_description, deal_price, deal_expiry_date, deal_items, restaurant_id, deal_id ];

        if(file){
            query = `UPDATE deal SET deal_title = ?, deal_description = ?, deal_price = ?, deal_expiry_date = ?, deal_items = ?, restaurant_id = ?, deal_image = ? WHERE deal_id = ?`
            queryValues = [ deal_title, deal_description, deal_price, deal_expiry_date, deal_items, restaurant_id, file.path, deal_id ]; 
        }

        sql.query(query, queryValues, (err, result) =>{
            if (err) return res.send(err); 
            
            return res.json({
                status: true,
                msg: 'Deal updated successfully'
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

exports.deleteDeal = async (req, res) =>{

    try {
        const id = req.query.deal_id;
        sql.query('DELETE FROM deal WHERE deal_id = ?',[ id ], (err, result) =>{
            if (err) return res.send(err);

            return res.json({
                status: true,
                msg: 'Deal deleted successfully'
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

exports.getDeal = async (req, res) =>{

    try {
        const id = req.query.deal_id;
        console.log(req.query)
        sql.query(`SELECT * FROM deal as d
                   INNER JOIN restaurant as r
                   ON d.restaurant_id = r.restaurant_id
                   WHERE d.deal_id = ?`, [ id ], (err, result) =>{
            if (err) return res.send(err);

            return res.json({
                status: true,
                msg: 'Deal fetched successfully',
                data: result[0] //zero for single record
            });
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}

exports.getDeals = async (req, res) =>{

    try {
        sql.query(`SELECT * FROM deal as d
                   INNER JOIN restaurant as r
                   ON d.restaurant_id = r.restaurant_id`, (err, result) =>{

            if (err) return res.send(err);
            
            return res.json({
                status: true,
                msg: 'Deals fetched successfully',
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

exports.getClientDeals = async (req, res) =>{

    try {
        const { latitude, longitude, kilometers } = req.query;
        const serverDate = moment(Date.now()).format('YYYY-MM-DD');

        let query = `SELECT * FROM (SELECT *,(((acos(sin(( ${latitude} * pi() / 180))
        * sin(( restaurant.restaurant_latitude * pi() / 180)) + cos(( ${latitude} * pi() /180 )) 
        * cos(( restaurant.restaurant_latitude * pi() / 180)) * cos(((${longitude} - restaurant.restaurant_longitude)
        * pi()/180)))) * 180/pi() ) * 60 * 1.1515 * 1.609344) as distance FROM restaurant) restaurant
        LEFT JOIN deal as d ON d.restaurant_id = restaurant.restaurant_id
        WHERE distance <= ${kilometers} AND ${serverDate} < d.deal_expiry_date AND restaurant.restaurant_status = 1 AND d.deal_status = 1 GROUP BY d.deal_id`

        sql.query(query, (err, result) =>{
            if (err) return res.send(err);

            if (result.length < 1) {
                return res.json({
                    status: true,
                    msg: 'No deals available',
                })
            }
           
            result.forEach(item => {
                console.log(item.deal_items);
            });

            return res.json({
                status: true,
                msg: 'Deals fetched successfully',
                data: result
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