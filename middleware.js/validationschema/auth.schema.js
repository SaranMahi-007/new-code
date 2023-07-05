const joi = require("@hapi/joi");


const schema = {
    signup: joi.object({
        email: joi.string().email().max(100).required().min(1),
        password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")).required().min(1),
    name:joi.string().min(1).optional(),
    country:joi.string().min(1).optional(),
    phone_number:joi.string().min(1).optional(),
    location:joi.string().min(1).optional(),
    preferred_currency:joi.string().min(1).optional(),
    charity_type:joi.string().min(1).optional(),
    email_id:joi.string().min(1).optional(),
    charity_id:joi.string().min(1).optional(),
    logo:joi.string().min(1).optional(),
    }),
    login: joi.object({
        email: joi.string().email().required().min(1),
        password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$")).required().min(1),
    }),

};

module.exports = schema;