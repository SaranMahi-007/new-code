const{sendmailotp, updatemobilepassword,phonenumberotp,updateemailpassword,updatepasswordusephonenumber,forgotuser,verifyuserotp,forgotphonenumber}=require('../validationschema/user.schema')

let sendmailotpValidation = async (req, res, next) => {
    let value = await sendmailotp.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let phonenumberotpValidation = async (req, res, next) => {
    let value = await phonenumberotp.validate(req.body);
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
    let value = await forgotuser.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let sendotpbyphonenumberValidation = async (req, res, next) => {
    let value = await forgotphonenumber.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let verifyuserotpValidation = async (req, res, next) => {
    let value = await verifyuserotp.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let updateuseremailpasswordValidation = async (req, res, next) => {
    let value = await updateemailpassword.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let sendotpusephonenumberValidation = async (req, res, next) => {
    let value = await updatepasswordusephonenumber.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}

let updatephonenumberpasswordValidation = async (req, res, next) => {
    let value = await  updatemobilepassword.validate(req.body);
    if (value.error) {
        res.json({
            success: false,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}
module.exports={sendmailotpValidation,updatephonenumberpasswordValidation,sendotpusephonenumberValidation,phonenumberotpValidation, updateuseremailpasswordValidation,verifyuserotpValidation,forgotemailValidation,sendotpbyphonenumberValidation}