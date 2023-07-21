const {signup,login,forgot,verifyotp,confirmpassword} =require('../validationschema/auth.schema') 

let signupValidation = async (req, res, next) => {
    let value = await signup.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let loginValidation = async (req, res, next) => {
    let value = await login.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}
let forgotemailValidation = async (req, res, next) => {
    let value = await forgot.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let verifyotpValidation = async (req, res, next) => {
    let value = await verifyotp.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let confirmpasswordValidation = async (req, res, next) => {
    let value = await confirmpassword.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

module.exports = { signupValidation, loginValidation,forgotemailValidation ,verifyotpValidation,confirmpasswordValidation};