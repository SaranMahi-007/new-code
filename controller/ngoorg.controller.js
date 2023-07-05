
const validation = require('../middleware.js/validation/auth.validation')
const { client } = require('../client');
const { gql } = require("graphql-request");
const bcrypt = require('bcrypt');
const { generateJWT } = require('../jwt')
const { request } = require("graphql-request");
const endpoint = "https://pockets-dev.digimeta.dev/v1/graphql";
const adminSecret = "Apid54as890vai67shu654na98vi";
const fast2sms = require('fast-two-sms')
const otpGenerator = require("otp-generator");
var nodemailer = require("nodemailer");
const emailValidator = require('email-validator');
const fs = require("fs");
const handlebars = require("handlebars");

exports.register = async (req, res) => {
  var newEmail;

  const reqBody = req.body;
  var bodyPassword = reqBody.password
  var bodyEmail = reqBody.email
  var bodyName = reqBody.name

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(bodyEmail)) {
    return res.status(400).send({
      message: "Invalid email address",
    });
  }
  console.log("body",bodyPassword)
  console.log("body email is ", bodyEmail)
  console.log("body email is ", bodyName)
  reqBody.password = await bcrypt.hash(req.body.password, 10);

  const existEmail = `query MyQuery {
    mst__ngos(where: {email: {_eq: "${bodyEmail}"}}) {
      email
      
    }
  }`
  await request(endpoint, existEmail, null, {
    "x-hasura-admin-secret": adminSecret,
  }).then(async (email) => {
    console.log("emailidis", email)

    if (email.mst__ngos.length === 0) {
      const { insert_mst__ngos_one } = await client.request(
        gql`
          mutation registerUser($mst__ngos: mst__ngos_insert_input!) {
            insert_mst__ngos_one(object: $mst__ngos) {
              id
            }
          }
        `,
        {
          mst__ngos: reqBody,
        }
      );
      

      const { id: userId } = insert_mst__ngos_one;
      if (req.body.email === "admin@pockets.com") {
        console.log(req.body.email)
        console.log("im coming")
        res.send({
          token: generateJWT({
            defaultRole: "admin",
            allowedRoles: ["admin"],
            otherClaims: {
              "X-Hasura-User-Id": userId,
            },
          }),
        })
        emailtrigger(bodyPassword,bodyEmail,bodyName)
      }
      else {
        console.log("not coming")
        res.send({
          token: generateJWT({
            defaultRole: "ngo",
            allowedRoles: ["ngo"],
            otherClaims: {
              "X-Hasura-User-Id": userId,
            },
          }),
        })
        emailtrigger(bodyPassword,bodyEmail,bodyName)
      }
    }
    else if (req.body.email === email.mst__ngos[0].email) {
      console.log("Email Is Already Exists")
      res.status(500).send({
        message: "Email ID Is Already Exists",
      })
    }
  })
}

const emailtrigger =(bodyPassword,bodyEmail,bodyName)=>{
   const emailTemplateSource =  fs.readFileSync('./views/email.handlebars', "utf8");
   const emailTemplate = handlebars.compile(emailTemplateSource)
   const emaildata ={
    user:bodyName,
    Username:bodyName,
    Email:bodyEmail,
    Password:bodyPassword
   }
   const emailHtml = emailTemplate(emaildata);
   console.log(emailHtml)
   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vinsoftuser@gmail.com',
      pass: 'uvfbnxeiehrycrgg'
    }
  });
  var mailOptions = {
  
    from: 'vinsoftuser@gmail.com',
    to: bodyEmail,
    subject: 'confirmation otp',
    //text: `Your confirmation OTP is ${otp}`,
    html:emailHtml
    
};
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    res.status(200).send({
      'Success': true, 'message': 'Email and OTP send successfully'
    })
  });

}

exports.login = async (req, res) => {
  const { email, password, ngoname, ngologo } = req.body;
  console.log(req.body, 'req.body');

  let { mst__ngos } = await client.request(
    gql`
        query getUserByEmail($email: String!) {
          mst__ngos(where: { email: { _eq: $email } }) {
            id
            password
          }
        }
      `,
    {
      email,
    }
  );

  // Since we filtered on a non-primary key we got an array back
  mst__ngos = mst__ngos[0];

  if (!mst__ngos) {

    res.sendStatus(401)
    return;
  }

  // Check if password matches the hashed version
  const passwordMatch = await bcrypt.compare(password, mst__ngos.password);
  if (req.body.email === "admin@pockets.com") {
    console.log("welcome to login")
    if (passwordMatch) {
      res.send({
        Success: true,
        token: generateJWT({
          defaultRole: "admin",
          allowedRoles: ["admin"],
          otherClaims: {
            "X-Hasura-User-Id": mst__ngos.id,
          },
        }),
      });
    }
    else {
      res.status(401).send({
        'Success': false, 'message': 'Please Enter Your admin Valid Password',
      })
    }
  }
  else if (req.body.email != "admin@pockets.com") {
    console.log("not welcome to login")
    if (passwordMatch) {
      console.log("vanakam",passwordMatch)
      res.send({
        Success: true,
        token: generateJWT({
          defaultRole: "ngo",
          allowedRoles: ["ngo"],
          otherClaims: {
            "X-Hasura-User-Id": mst__ngos.id,
          },
        }),
      });
    }
    else {
      res.status(401).send({
        'Success': false, 'message': 'Please Enter Your Valid Password',
      })
    }
  }

};

exports.forgot = async (req, res) => {
  var emailID = req.body.email
  try {
    const userEmail = `query MyQuery {
      mst__ngos(where: {email: {_eq: "${emailID}"}}) {
        email
        id
        phone_number
      }
    }`
    await request(endpoint, userEmail, null, {
      "x-hasura-admin-secret": adminSecret,
    }).then(async (emaildata) => {
      console.log("email", emaildata)

      var newsaveEmail = emaildata.mst__ngos[0].email
      var newsaveID = emaildata.mst__ngos[0].id
      var phonenumber = emaildata.mst__ngos[0].phone_number
      if (emaildata.mst__ngos[0].email === emailID) {
        var generateOtp = otpGenerator.generate(4, {
          upperCaseAlphabets: false,
          specialChars: false,
          lowerCaseAlphabets: false,
        });
        console.log("emailid", generateOtp)
        const savedata = `mutation MyMutation {
    insert_mst_ngo_forgot_otp(objects: {email: "${newsaveEmail}", ngo_id: "${newsaveID}", otp:"${generateOtp}"}) {
      affected_rows
    }
  }`
        await request(endpoint, savedata, null, {
          "x-hasura-admin-secret": adminSecret,
        })


        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'vinsoftuser@gmail.com',
            pass: 'uvfbnxeiehrycrgg'
          }
        });
        var mailOptions = {

          from: 'vinsoftuser@gmail.com',
          to: emailID,
          subject: 'Forgot Password',
          text: `Your confirmation OTP is ${generateOtp}`,

        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
          res.status(200).send({
            'Success': true, 'message': 'Email and OTP send successfully'
          })


        });
      }

    })
  } catch (err) {
    console.log(err)

    res.status(401).send({
      'Success': false, 'message': 'You are not register vaild email in ngo',
    })

  }
}

exports.verifyotp = async (req, res) => {
  var userOtp = req.body.otp
  var userEmailID = req.body.email
  var userPassword = req.body.password

  console.log("user", userOtp)
  try {
    var hashPassword;
    const emailandOtp = `query MyQuery {
    mst_ngo_forgot_otp(where: {email: {_eq: "${userEmailID}"}, otp: {_eq: "${userOtp}"}}) {
      email
      otp
    }
  }`
    await request(endpoint, emailandOtp, null, {
      "x-hasura-admin-secret": adminSecret,
    }).then(async (data) => {
      console.log(data.mst_ngo_forgot_otp[0].otp)
      if (data.mst_ngo_forgot_otp[0].otp === userOtp) {
        console.log("cominh here")
        var hashpassword = await bcrypt.hash(userPassword, 10);
        console.log("hash", hashpassword)
        const updatePassword = `mutation MyMutation {
          update_mst__ngos(where: {email: {_eq: "${userEmailID}"}}, _set: {password: "${hashpassword}"}) {
            affected_rows
          }
        }`
        await request(endpoint, updatePassword, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        res.status(200).send({
          'Success': true, 'message': 'OTP Verified Successfully'
        })

      }
    })
  }
  catch (err) {
    res.status(401).send({
      'Success': false, 'message': 'Invalied otp or email',
    })

  }
}

exports.confirmpassword= async (req, res) => {
    var ngoEmail = req.body.email
    var ngoOldpassword = req.body.oldpassword
    var ngoNewpassword = req.body.newpassword
    const currentTimestamp = new Date().toISOString();
    try {
      const updatePassword = `query MyQuery {
    mst__ngos(where: {email: {_eq: "${ngoEmail}"}}) {
      email
      password
      id
    }
  }`
      await request(endpoint, updatePassword, null, {
        "x-hasura-admin-secret": adminSecret,
      }).then(async (data) => {
        console.log(data)
        if (data.mst__ngos[0] === undefined) {
          
          res.status(401).send({
            'Success': false, 'message': 'your email id is not same',
          })
        }
        else {
          var decryptpassword = data.mst__ngos[0].password
  console.log("",decryptpassword)
          const isMatch = await bcrypt.compare(ngoOldpassword, decryptpassword);
          console.log(isMatch);
          if (isMatch === false) {
            
            res.status(401).send({
              'Success': false, 'message': 'your Password Is Incorrect',
            })
          }
          else if (isMatch === true) {
            console.log("saran")
            var hashpassword = await bcrypt.hash(ngoNewpassword, 10);
            console.log("hash", hashpassword)
            const newUpdatePassword = `mutation MyMutation {
              update_mst__ngos(
                where: { email: { _eq: "${ngoEmail}" } }
                _set: {
                  password: "${hashpassword}"
                  password_updated_at: "${currentTimestamp}"
                }
              ) {
                affected_rows
              }
            }`
            await request(endpoint, newUpdatePassword, null, {
              "x-hasura-admin-secret": adminSecret,
            })
              
            res.status(200).send({
              'Success': true, 'message': 'Password Updated Successfully',
            })
  
          }
        }
  
      })
    } catch (err) {
      console.log(err)
    }
  }   