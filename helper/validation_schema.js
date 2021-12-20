const Joi = require('joi');
const JoiPhone = Joi.extend(require('joi-phone-number'));

const loginSchema = Joi.object().keys({
    email: Joi.string().required().email().messages({
        "string.empty": "Email must no be empty",   
        "any.required": "Email is required",
        "string.email": "Email is not valid"
    }),
    password: Joi.string().required().min(6).messages({
        "string.empty": "Password must not empty",
        "any.required": "Password is required",
        "string.min": "Password is too short"
    })
});

const registerSchema = Joi.object().keys({
    email: Joi.string().required().email().lowercase().messages({
        "string.empty": "Email must not be empty",   
        "any.required": "Email is required",
        "string.email": "Email is not valid"
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password must not empty",
        "any.required": "Password is required",
        "string.min": "Password is too short"
    }),
    confirm_password: Joi.string().required().min(6).valid(Joi.ref('password')).messages({
        "any.only": "Password does not match",
        "string.empty": "Confirm Password must not empty",
        "any.required": "Confirm password is required",
        "string.min": "Confirm password is too short"
    }),
    phone: Joi.string().min(10).max(16).required().messages({
        "string.min": "Phone number length is not valid",
        "string.empty": "Phone number must not be empty",
        "any.required": "Phone number is required",
        "string.min": "Phone number is too short",
        "string.max": "Phone number is too long"
    })
});

const verifySchema = Joi.object().keys({
    phone: Joi.string().min(10).max(16).required().messages({
        "string.min": "Phone number length is not valid",
        "string.empty": "Phone number must not be empty",
        "any.required": "Phone number is required",
        "string.min": "Phone number is too short",
        "string.max": "Phone number is too long"
    }),
    verification_code: Joi.string().required().min(4).messages({
        "string.empty": "Verify code must not be empty",
        "any.required": "Verify code is required",
        "string.min": "Verify code is not valid"
    })
});


const riderRegisterSchema = Joi.object().keys({
    name: Joi.string().required().messages({
        "string.empty": "Name must no be empty",   
        "any.required": "Name is required",
    }),
    phone: Joi.string().min(10).max(16).required().messages({
        "string.min": "Phone number length is not valid",
        "string.empty": "Phone number must not be empty",
        "any.required": "Phone number is required",
        "string.min": "Phone number is too short",
        "string.max": "Phone number is too long"
    }),
    email: Joi.string().required().email().lowercase().messages({
        "string.empty": "Email must no be empty",   
        "any.required": "Email is required",
        "string.email": "Email is not valid"
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password must not empty",
        "any.required": "Password is required",
        "string.min": "Password is too short"
    }),
    confirm_password: Joi.string().required().min(6).valid(Joi.ref('password')).messages({
        "any.only": "Password does not match",
        "string.empty": "Confirm Password must not empty",
        "any.required": "Confirm password is required",
        "string.min": "Confirm password is too short"
    })
});

const riderVerifySchema = Joi.object().keys({
    phone: Joi.string().min(10).max(16).required().messages({
        "string.min": "Phone number length is not valid",
        "string.empty": "Phone number must not be empty",
        "any.required": "Phone number is required",
        "string.min": "Phone number is too short",
        "string.max": "Phone number is too long"
    }),
    verification_code: Joi.string().required().min(4).messages({
        "string.empty": "Verify code must not be empty",
        "any.required": "Verify code is required",
        "string.min": "Verify code is not valid"
    })
});

module.exports = {
    loginSchema,
    registerSchema,
    verifySchema,
    riderRegisterSchema,
    riderVerifySchema
}