'user strict';
const sql = require('../connection');
const jwt = require('jsonwebtoken');

exports.checkToken = (req, res, next) =>{
    const headers = req.headers

    let response = {
        status: false,
        msg: ""
    }

    // when no header is not present in req
    if (!headers.authorization) {
        response.status = false;
        response.msg = "Authorization header is required";
        return res.status(401).send(response);
    } 

    const token = headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'SECRETKEY');
        const email = decoded.user_email;

        sql.query('SELECT user_email FROM user WHERE user_email = ?', [ email ], (err, result) =>{

            if (err) {
                response.status = false;
                response.msg = "Invalid token"
                return res.status(401).send(response);
            }

            if (result.length > 0) {
                //console.log("Token is valid")
                next()
            } else{
                response.status = false;
                response.msg = "Something went wrong"
                return res.json(response);
            }
        });

    } catch(error){
        response.status = false;
        response.msg = "Invalid token"
        return res.status(401).send(response);
    }
    
}