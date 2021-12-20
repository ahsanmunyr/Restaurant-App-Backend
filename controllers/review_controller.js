'user strict';
const sql = require('../connection');

exports.createReview = async (req, res) =>{

    try {
        const { restaurant_id, review_text, rating } = req.body;

        sql.query('INSERT INTO review(restaurant_id, review_text, rating) VALUES(?,?,?)', [ restaurant_id, review_text, rating ], (err, result) =>{
            if (err) return res.send(err);
            
            return res.json({
                status: true,
                msg: 'Review created successfully'
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