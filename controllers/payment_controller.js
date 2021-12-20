'user strict';
const sql = require('../connection');

const stripe = require('stripe')('sk_test_51JZ8K5BKBDzbPNJ1kIIlxPGHOBhH5isUMC5CzjXuR6STbMtzqipV4OVNIppGxWtVPYHDCBZ4FXATi1sfdMVIGuLA00tvhlXO2t');

exports.pay = async (req, res) =>{

    const { amount, currency, stripeToken } = req.body;

    try {
        // sql.query(`SELECT res.*, count(rev.review_id) as totat_reviews, rating FROM restaurant as res 
        //            LEFT JOIN review as rev 
        //            ON rev.restaurant_id = res.restaurant_id 
        //            GROUP BY res.restaurant_id`,
        //             (err, result) =>{
        //     if (err) return res.send(err);
        //     return res.json({
        //         status: true,
        //         msg: 'Payment done',
        //         data: result
        //     })
        // })

        const response = await stripe.charges.create({
            amount: amount * 100,
            currency: 'USD',
            source: stripeToken,
        })

        return res.json({
            status: true,
            msg: 'Payment done',
            data: response
        }) 

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}