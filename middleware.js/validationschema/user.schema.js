const joi = require("@hapi/joi");

const schema ={
    sendmailotp:joi.object({
        email: joi.string().email().max(100).required().min(1),
        otp:joi.number().integer()
        .min(1000) 
        .max(9999) 
        .required(),
       
    }),
    phonenumberotp :joi.object({
      phonenumber:  joi.string()
  .pattern(/^[0-9]{10}$/) 
  .required(),
        otp:joi.number().integer()
        .min(1000) 
        .max(9999) 
        .required(),
       
    }),

    forgotuser:joi.object({
        email: joi.string().email().max(100).required().min(1)
       
    }),
    forgotphonenumber:joi.object({
        phonenumber:  joi.string()
        .pattern(/^[0-9]{10}$/) // Assumes a 10-digit phone number format
        .required()
       
    }),
    verifyuserotp:joi.object({
        email: joi.string().email().max(100).required().min(1),
        otp:joi.number().integer()
        .min(1000) 
        .max(9999) 
        .required(),
       
    }),
    updateemailpassword:joi.object({
        email: joi.string().email().max(100).required().min(1),
        password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")).required().min(1)
    }),
    updatepasswordusephonenumber:joi.object({
        phonenumber:  joi.string()
        .pattern(/^[0-9]{10}$/) 
        .required(),
        otp:joi.number().integer()
        .min(1000) 
        .max(9999) 
        .required(),
    }),
    updatemobilepassword:joi.object({
        phonenumber:  joi.string()
        .pattern(/^[0-9]{10}$/) 
        .required(),
        password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")).required().min(1)
    }),
}

module.exports = schema;