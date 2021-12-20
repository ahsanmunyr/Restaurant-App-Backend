'user strict';
const sql = require('../connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');

const { loginSchema, riderRegisterSchema, riderVerifySchema } = require('../helper/validation_schema');
const TwillioOTP = require('../helper/TwillioOTP');

exports.register = async (req, res) =>{

    try {
        const body = req.body;

        if (req.files == undefined) {
            return res.json({
                status: false,
                msg: 'Document images are required'
            });
        }

        console.log("Files ----------------------->", req.files);

        let {license_image, cnic_front, cnic_back} = req.files;
        
        //Validating images that are required for registeration
        if (!license_image || !license_image[0]) {
            return res.json({
                status: false,
                msg: 'License image is required'
            });
        } else if(!cnic_front || !cnic_front[0]){
            return res.json({
                status: false,
                msg: 'Cnic front image is required'
            });
        } else if (!cnic_back || !cnic_back[0]) {
            return res.json({
                status: false,
                msg: 'Cnic back image is required'
            });
        }

        license_image = license_image[0];
        cnic_front = cnic_front[0];
        cnic_back = cnic_back[0];
        
        await riderRegisterSchema.validateAsync(body)
        .then(result =>{
            const { name, phone, email, password, confirm_password } = result;

            //user not exists 
            const hashPassword = bcrypt.hashSync(password, saltRounds);

            const token = jwt.sign(
                {
                    rider_phone:phone
                },
                'SECRETKEY',
                {expiresIn: '1h'}
            );
            sql.query(`INSERT INTO rider (rider_name, rider_phone, rider_email, rider_password, 
                rider_license_image, rider_cnic_image_front, rider_cnic_image_back, rider_token) 
                VALUES (?,?,?,?,?,?,?,?)`, 
                [name, phone, email, hashPassword, license_image.path, cnic_front.path, cnic_back.path, token] , (err, rows) =>{
                if(err){
                    return res.json({
                        status: false,
                        msg: err,
                    });
                }

                return res.json({
                    status: true,
                    msg: "User registered successfully",
                    data: {
                        rider_id: rows.insertId,
                        rider_email: email,
                        rider_name: name,
                        rider_phone: phone,
                        token
                    }
                })
            })
        })
        .catch(err =>{
            return res.json({
                status: false,
                msg: err.details[0].message
            });
        })
    
        } catch(e) {
            console.log('Catch an error: ', e)
            return res.json({
                status: false,
                msg: "Something went wrong",
            }) 
        }
    };

exports.verify = async (req, res) =>{

    try {
        const body = req.body;

        //validating email
        await riderVerifySchema.validateAsync(body)
        .then((result) =>{
            const {phone, verification_code} = result;

            TwillioOTP.verifyOtp(phone, verification_code)
            .then(verification_check =>{
                console.log(verification_check);
                if(verification_check.valid){
                    return res.json({
                        status: true,
                        msg: 'Verified successfully',
                    });
                } else {
                    return res.json({
                        status: false,
                        msg: 'Incorrect code',
                    });
                }
            })
            .catch(e =>{
                console.log(e.status);
                if (e.status == 404) {
                    return res.status(400).send({
                        status: false,
                        msg: 'Incorrect code',
                    });
                }
                return res.send(e);
            });

            }).catch(error =>{
                return res.json({
                    status: false,
                    msg: error.details[0].message
                });
            });
    } catch(e) {
        console.log('Catch an error: ', e);
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
        await loginSchema.validateAsync(body)
        .then((result)=>{
            const {email, password} = result;
            //checking if user exists against this email
            sql.query('SELECT * FROM rider WHERE rider_email = ?', [ email ], async (err, row) => {
                if(err) return res.send(err);
                
                if(row.length > 0){

                    //user exists match its email and password
                    const {rider_id, rider_email, rider_name, rider_phone, rider_image, rider_password, rider_status, rider_online} = row[0];

                    const hashResult = await bcrypt.compare(password, rider_password);
                    console.log("Hash password", hashResult);

                        // It means password is correctly decryted and matched
                        if(hashResult){

                            if (rider_status == 0) {
                                return res.json({
                                    status: false,
                                    msg: "Your request is pending",
                                });
                            }
                            
                            const token = jwt.sign(
                                {
                                    rider_phone
                                },
                                'SECRETKEY',
                                {expiresIn: '1h'}
                            );
                            console.log('agaya');

                            sql.query('UPDATE rider SET rider_token = ? WHERE rider_id = ?', [ token, rider_id ], async (err, row) =>{
                                if(err) return res.json({
                                    status: false,
                                    msg: "Something went wrong",
                                });

                                return res.json({
                                    status: true,
                                    msg: "Login successful",
                                    data: {
                                        rider_id,
                                        rider_email,
                                        rider_name,
                                        rider_phone,
                                        rider_image,
                                        rider_online,
                                        token
                                    }
                                });
                            })
                            
                    } else {
                        return res.json({
                            status: false,
                            msg: "Bad credentials"
                        });
                    }

                } else {
                    //user not exists
                    return res.json({
                        status: false,
                        msg: "User not found"
                    });  
                }
            })
        }).catch((error)=>{
            return res.json({
                status: false,
                msg: error.details[0].message
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

exports.checkUser = async (req, res) =>{

    try {
        const { phone, email } = req.body;
        
        //checking if user exists against this email
        sql.query('SELECT * FROM rider WHERE rider_email = ? OR rider_phone = ?', [ email, phone ], async (err, row) => {

            if(err) return res.send(err);
            
            if(row.length > 0){
                //user already exists
                return res.json({
                    status: false,
                    msg: 'Email or number is already taken, use another',
                });
            }

            TwillioOTP.sendOtp(phone)
            .then((verification) =>{
                console.log('OTP sent', verification);

                return res.json({
                    status: true,
                    msg: "Otp Sent",
                });
            }).catch((e) =>{
                console.log('OTP sending failed', e);
                return res.json({
                    status: false,
                    msg: "Registeration failed, try again",
                });
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

exports.online = async (req, res) =>{

    try {

        const {rider_id} = req.query;

        sql.query(`SELECT rider_online FROM rider WHERE rider_id = ${rider_id}`, (err, result) =>{
            if (err) return res.send(err);
            
            const {rider_online} = result[0];
            let online = 1;
            let online_status = true;
            let msg = 'Rider is now online';

            if (rider_online == 1) {
                online = 0;
                online_status = false;
                msg = 'Rider is now offline';
            }

            sql.query(`UPDATE rider SET rider_online = ${online} WHERE rider_id = ${rider_id}`, (onlineError, onlineResult) =>{
                if (onlineError) return res.send(onlineError);

                return res.json({
                    status: true,
                    msg: msg,
                    data: {
                        rider_online: online_status
                    }
                })
            })
            
        })

    } catch(e) {
        console.log('Catch an error: ', e)
        return res.json({
            status: false,
            msg: "Something went wrong",
        });
    }
};