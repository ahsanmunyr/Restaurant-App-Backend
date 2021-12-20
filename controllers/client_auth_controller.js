'user strict';
const sql = require('../connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');

const { loginSchema, registerSchema, verifySchema } = require('../helper/validation_schema');

const TwillioOTP = require('../helper/TwillioOTP');

exports.register = async (req, res) =>{

    try {
        const body = req.body;

        // validating email, password and repeat password
        await registerSchema.validateAsync(body)
        .then((result)=>{
            const { email, password, confirm_password, phone } = result; 
            //checking if user exists against this email
            sql.query('SELECT * FROM user WHERE user_email = ? OR user_phone = ?', [ email, phone ], async (err, row) => {
                if(!err) {
                    if(row.length > 0){
                    //user already exists
                        return res.json({
                            status: false,
                            msg: "Email or number is already taken, use another"
                        });
                    }
                    //user not exists 
                    const hashPassword = await bcrypt.hashSync(password, saltRounds);
                    console.log("Hash password", hashPassword)

                    sql.beginTransaction(transactionError =>{
                        if(transactionError) return res.json({
                            status: false,
                            msg: transactionError,
                        })

                        sql.query('INSERT INTO user (user_email, user_phone, user_password) VALUES (?,?,?)', [email, phone, hashPassword] , (err, rows) =>{
                            if(err) return res.json({
                                status: false,
                                msg: err,
                            });
    
                            TwillioOTP.sendOtp(phone)
                            .then(verification =>{
                                console.log('OTP sent', verification);
                                sql.commit((commitErr) =>{
                                    if (commitErr) {
                                        sql.rollback(() =>{
                                            return res.json({
                                                status: false,
                                                msg: "Registeration failed, try again",
                                            });
                                        });
                                    }
    
                                    return res.json({
                                        status: true,
                                        msg: "User registered successfully, check your OTP",
                                    });
                                })
                                
                            }).catch((e) =>{
                                console.log('OTP sending failed', e);
                                sql.rollback(() =>{
                                    return res.json({
                                        status: false,
                                        msg: "Registeration failed, try again",
                                    });
                                })
                            });
                        });
                    });
            } else{
                res.send(err);
            }
        })
    }).catch((err)=>{
        return res.json({
            status: false,
            msg: err.details[0].message
        });
    });
        } catch(e) {
            console.log('Catch an error: ', e)
            return res.json({
                status: false,
                msg: "Something went wrong",
            });
        }
    };

exports.verify = async (req, res) =>{

    try {
        const body = req.body;

        //validating email
        await verifySchema.validateAsync(body).then((result) =>{
            const {phone, verification_code} = result;

            // checking if user exists against this email
            sql.query('SELECT * FROM user WHERE user_phone = ?', [ body.phone ], (err, row) => {
                if(!err) {
                    //getting user data from 0 index because it will always one record per email 
                    const userData = row[0];
                    
                    if(row.length > 0){

                        TwillioOTP.verifyOtp(phone, verification_code)
                        .then(verification_check =>{
                            if (verification_check.valid) {
                                //here generate jwt
                                const token = jwt.sign({user_email: userData.user_email}, 'SECRETKEY', {expiresIn: '1h'});

                                sql.query('UPDATE user SET user_status = ?, user_token = ? WHERE user_phone = ? ', [1, token, phone] , (err, rows) =>{
                                    if(err) return res.json({
                                                status: false,
                                                msg: err
                                            });
                                    return res.json({
                                        status: true,
                                        msg: 'Verified successfully',
                                        data: {
                                            id: userData.user_id,
                                            email: userData.user_email,
                                            username: userData.user_name,
                                            user_phone: userData.user_phone,
                                            user_address: userData.user_address,
                                            user_image: userData.user_image,
                                            status: 1,
                                            token
                                        }
                                    });
                                });
                            }else{
                                return res.json({
                                    status: false,
                                    msg: 'Incorrect code'
                                });
                            }
                        })
                        .catch(e =>{
                            return res.send(e);
                        });
                                
                    } else {
                    //user not exists 
                        console.log('User does not exist in db')                
                        return res.json({
                            status: false,
                            msg: 'User does not exist',
                        });
                    }
                    
                } else{
                    res.send(err);
                }
            })

            }).catch((error)=>{
                return res.json({
                    status: false,
                    msg: error.details[0].message
                });
            })
    } catch(e) {
        console.log('Catch an error: ', e)
        return res.json({
            status: false,
            msg: "Something went wrong",
        }); 
    }
};

exports.login = async (req, res) =>{

    try {
        const body = req.body;

        //validatiing email and password here
        await loginSchema.validateAsync(body).then((result)=>{

                console.log("Email and password is valid")

                //checking if user exists against this email
                sql.query('SELECT * FROM user WHERE user_email = ?', [ body.email ], async (err, row) => {
                    if(!err) {
                        if(row.length > 0){

                            //user exists match its email and password
                            const {user_id, user_email, user_name, user_phone, user_image, user_address, user_status, user_password} = row[0];

                            const hashResult = await bcrypt.compare(body.password, user_password);
                            console.log("Hash password", hashResult);

                                // It means password is correctly decryted and matched
                                if(hashResult){

                                    //here generate jwt
                                    const token = jwt.sign(
                                        {
                                            user_email
                                        },
                                        'SECRETKEY',
                                        {expiresIn: '1h'}
                                    );

                                    sql.query('UPDATE user SET user_token = ? WHERE user_id = ?', [ token, user_id ], async (err, row) =>{
                                        if(err) return res.json({
                                            status: false,
                                            msg: "Something went wrong",
                                        }) 

                                        return res.json({
                                            status: true,
                                            msg: "Login successful",
                                            data: {
                                                user_id,
                                                user_email,
                                                user_name,
                                                user_phone,
                                                user_image,
                                                user_address,
                                                user_status,
                                                token,
                                            }
                                        })
                                    })
                                    
                            } else {
                                    return res.json({
                                        status: false,
                                        msg: "Bad credentials"
                                    })
                            }

                        } else {
                            //user not exists
                            return res.json({
                                status: false,
                                msg: "User not found"
                            }); 
                        }
                        
                    } else{
                        return res.send(err);
                    }
                })
            }).catch((error)=>{
                return res.json({
                    status: false,
                    msg: error.details[0].message
                });
            })
    } catch(e) {
        console.log('Catch an error: ', e)
        return res.json({
            status: false,
            msg: "Something went wrong",
        });
    }
};