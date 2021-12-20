'user strict';
const sql = require('../connection');

exports.getUsers = async (req, res) =>{

    try {
        const body = req.body;
        sql.query('SELECT user_id, user_name, user_email, user_phone, user_address, user_image, user_status FROM user', (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'Users fetched successfully',
                    data: result
                })
            } else{
                return res.send(err);
            }
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

exports.getUser = async (req, res) =>{

    try {
        const id = req.query.user_id;
        sql.query('SELECT user_id, user_name, user_email, user_phone, user_address, user_image, user_status FROM user WHERE user_id = ? ', id, (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'User fetched successfully',
                    data: result[0]
                })
            } else{
                return res.send(err);
            }
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

exports.updateUser = async (req, res) =>{

    try {
        const { user_name, user_phone, user_address, user_id } = req.body;

        if (req.fileValidationError) {
            return res.json({
                status: false,
                msg: 'Upload valid file'
            }) 
       }

        let image = req.file;

        let query = 'UPDATE user SET user_name = ?, user_phone = ?, user_address = ? WHERE user_id = ?'
        let queryValues = [user_name, user_phone, user_address, user_id]

        if (image) {
            query = 'UPDATE user SET user_name = ?, user_phone = ? , user_address = ?, user_image = ? WHERE user_id = ?'
            queryValues = [user_name, user_phone, user_address, image.path, user_id]
        }

        sql.query(query, queryValues, (err, result) =>{
            if (!err) {
                return res.json({
                    status: true,
                    msg: 'User updated successfully'
                })
            } else{
                return res.send(err);
            }
        })

    } catch(e) {
        console.log('Catch an error: ', e);
        return res.json({
            status: false,
            msg: 'Something went wrong'
        }) 
    }

}