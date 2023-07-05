const {signup} =require('../validationschema/auth.schema') 

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
module.exports = { signupValidation };