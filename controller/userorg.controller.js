const { request } = require("graphql-request");
require("dotenv").config();
const endpoint = "https://web.pocketgiving.co.uk/v1/graphql";
const adminSecret = "AcdBFQjcVnQW987Py9785MvJ7567";
const fast2sms = require('fast-two-sms')
const otpGenerator = require("otp-generator");
var nodemailer = require("nodemailer");
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const twilio = require('twilio');
const fs = require("fs");
const handlebars = require("handlebars");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const brevoController = require('./brevo.controller')


const accountSid = 'AC9fdf1cfb08eb5a80012d3a0857b5f267';
const authToken = '26fc87191d511f9e922408c3dd4bc757';
const client = twilio(accountSid, authToken);




exports.sendotpbyemail = async (req, res) => {
  console.log("mail")
  var emailId = req.body.email
  var otp = req.body.otp

  try {
    const userEmail = `query MyQuery {
        users(where: {email: {_eq: "${emailId}"}}) {
          id
          email
        }
      }`
    await request(endpoint, userEmail, null, {
      "x-hasura-admin-secret": adminSecret,
    }).then((emaildata) => {
      console.log('emaildata', emaildata);
      if (emaildata.users[0] ? emaildata.users[0].email : "" == emailId) {
        console.log("already exist");
        res.status(400).json({ message: "user email already exist" })
      }
      else {
        const isvalid = emailValidator.validate(emailId)
        console.log(isvalid)
        if (isvalid === true) {
          // var transporter = nodemailer.createTransport({
          //   service: 'gmail',
          //   auth: {
          //     user: 'vinsoftuser@gmail.com',
          //     pass: 'uvfbnxeiehrycrgg'
          //   }
          // });
          // var mailOptions = {

          //   from: 'vinsoftuser@gmail.com',
          //   to: emailId,
          //   subject: 'confirmation otp',
          //   text: `Your confirmation OTP is ${otp}`,

          // };
          // transporter.sendMail(mailOptions, function (error, info) {
          //   if (error) {
          //     console.log(error);
          //   } else {
          //     console.log('Email sent: ' + info.response);
          //   }
          //   res.status(200).send({
          //     'Success': true, 'message': 'Email and OTP send successfully'
          //   })


          // });
          var subject = 'confirmation otp'
          var text = `Your confirmation OTP is ${otp} `
          brevoController.sendEmail(emailId,subject,text)
          res.status(200).send({
            'Success': true, 'message': `Email sent successfully`,
          })
        }
        else if (isvalid != true) {
          console.log("not valid email")
          res.status(401).send({
            'Success': false, 'message': 'Please Enter Your Valid EmailId',
          })
        }
      }
    })


  }
  catch (error) {
    console.log(error)
    res.status(401).send({
      'Success': false, 'message': 'some Error', error
    })
  }
}

exports.phonenumberotp = async (req, res) => {
  var phonenumber = req.body.phonenumber;
  var otp = req.body.otp;
  try {
    const userEmail = `query MyQuery {
        users(where: { metadata: { _contains: { phoneNumber: "${phonenumber}" } } }) {
          metadata
        }
      }`
    await request(endpoint, userEmail, null, {
      "x-hasura-admin-secret": adminSecret,
    }).then((exsitsNumber) => {
      console.log("%j", exsitsNumber)
      if (exsitsNumber.users[0] ? exsitsNumber.users[0].metadata.phoneNumber : "" == phonenumber) {
        console.log("already exist");
        res.status(400).json({ message: "User Phonenumber Already Exist" })
      }
      // else if(exsitsNumber.users.length == 0){
      //   res.status(400).json({ message: "user phoneNumber not register number" })
      // }
      else if (exsitsNumber.users.length == 0) {
console.log("saran")
var content = `Your OTP is ${otp}`
brevoController.sendSmsFunc(phonenumber, content)
res.status(200).send({
  'Success': true, 'message': 'Otp send successfully'
})
            }
    })
  }
  catch (error) {
    //console.log(error)
    res.status(401).send({
      'Success': false, 'message': 'Please enter valid phonenumber'
    })
  }
}

exports.forgotuser = async (req, res) => {
  var emailID = req.body.email
  try {
    var userEmail = `query MyQuery {
    users(where: {email: {_eq: "${emailID}"}}) {
      id
      email
      phoneNumber
    }
  }`
    await request(endpoint, userEmail, null, {
      "x-hasura-admin-secret": adminSecret,
    })
      .then(async (emaildata) => {
        console.log("email", emaildata)
        if (emaildata.users[0] ? emaildata.users[0].email : "" == emailID) {
          //console.log("email",emaildata.users[0].email)
          //console.log("id",emaildata.users[0].id)
          var newsaveEmail = emaildata.users[0].email
          var newsaveID = emaildata.users[0].id
          var phonenumber = emaildata.users[0].phoneNumber
          if (emaildata.users[0].email === emailID) {
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
            //sendOTPSMS(phonenumber, generateOtp);
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
              //return res.json({ 'Success': true, 'message': 'Email and OTP send successfully' })
              return res.status(200).send({
                'Success': true, 'message': 'Email and OTP send successfully'
              })
            });
          }
        }
        else {
          res.status(400).json({ message: `${emailID} not register user` })
        }


      })
  } catch (err) {
    console.log(err)
    res.status(401).json({
      Success: false, message: `Your (${emailID}) id is not registered`,
    })
    //res.json({ 'Success': false, 'message': 'You Are Not Register Vaild Email In user' })
  }
}

exports.forgotusermobile = async (req, res) => {
  var phonenumber

  try {
    phonenumber = req.body.phonenumber
    console.log("number is", phonenumber)
    var userEmail = `query MyQuery {
        users(where: { metadata: { _contains: { phoneNumber: "${phonenumber}" } } }) {
          metadata
        }
      }`
    var emaildata = await request(endpoint, userEmail, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    // console.log("%j",emaildata)

    var userMobilenumber = ("%j", emaildata.users[0] ? emaildata.users[0].metadata : undefined)
    console.log("number", userMobilenumber ? userMobilenumber.phoneNumber : undefined)
    var userquerynumber = userMobilenumber ? userMobilenumber.phoneNumber : undefined
    console.log("user number", userquerynumber)
    if (userquerynumber === phonenumber) {
      console.log("saran")

      var generateOtp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      console.log("emailid", generateOtp)
      const savedata = `mutation MyMutation {
                insert_mst_ngo_forgot_otp(objects: { phoneNumber: "${userquerynumber}", otp: "${generateOtp}", ngo_id: "null",email:"null" }) {
                  affected_rows
                }
              }`
      await request(endpoint, savedata, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      var content = `Your OTP is ${generateOtp} `
      brevoController.sendSmsFunc( phonenumber,content)

     res.status(200).json({message:"Otp send successfully"})
    }
    else {
      res.status(400).json({ message: `Your Phonenumber Is Not Registered` })
    }


  }
  catch (err) {
    console.log(err)

  }
}


exports.verifyuserotp = async (req, res) => {
  var userOtp = req.body.otp
  var userEmailID = req.body.email
  // var userPassword = req.body.password
  try {
    const emailandOtp = `query MyQuery {
        mst_ngo_forgot_otp(where: {email: {_eq: "${userEmailID}"}, otp: {_eq: "${userOtp}"}}) {
          email
          otp
        }
      }`
    await request(endpoint, emailandOtp, null, {
      "x-hasura-admin-secret": adminSecret,
    }).then(async (data) => {
      console.log("otp", data)
      console.log(data.mst_ngo_forgot_otp[0].otp)
      if (data.mst_ngo_forgot_otp[0].otp === userOtp) {
        console.log("cominh here")
        // var hashpassword = await bcrypt.hash(userPassword, 10);
        // console.log("hash", hashpassword)
        // const updatePassword = `mutation MyMutation {
        //     update_users_many(updates: {where: {email: {_eq: "${userEmailID}"}}, _set: {passwordHash: "${hashpassword}"}}) {
        //       affected_rows
        //     }
        //   }`
        // await request(endpoint, updatePassword, null, {
        //   "x-hasura-admin-secret": adminSecret,
        // })
        res.status(200).send({
          'Success': true, 'message': 'OTP Verified Successfully'
        })

      }
    })
  }
  catch (err) {
    console.log(err)
    res.status(401).send({
      'Success': false, 'message': 'Invalid otp or email',
    })

  }
}

exports.updatepassword = async (req, res) => {
  try {
    var userPassword = req.body.password
    var userEmailID = req.body.email
    var dataEmail;
    console.log("pass", userPassword)
    var userEmail = `query MyQuery {
        users(where: {email: {_eq: "${userEmailID}"}}) {
          id
          email
          phoneNumber
        }
      }`
    await request(endpoint, userEmail, null, {
      "x-hasura-admin-secret": adminSecret,
    })
      .then(async (emaildata) => {
        dataEmail = emaildata
      })
    console.log("email", dataEmail)
    if (dataEmail.users.length === 0) {
      console.log("saran")
      return res.status(401).send({
        'Success': false, 'message': 'Please enter registered email',
      })
    }
    else {
      var hashpassword = await bcrypt.hash(userPassword, 10);
      console.log("hash", hashpassword)
      const updatePassword = `mutation MyMutation {
           update_users_many(updates: {where: {email: {_eq: "${userEmailID}"}}, _set: {passwordHash: "${hashpassword}"}}) {
             affected_rows
           }
         }`
      await request(endpoint, updatePassword, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      return res.status(200).send({
        'Success': true, 'message': 'password updated Successfully'
      })
    }


  } catch (error) {
    console.log(error)
    res.status(401).send({
      'Success': false, 'message': 'Invalid password',
    })
  }
}

exports.verifyuserupdatepassword = async (req, res) => {
  var userOtp = req.body.otp
  var userphonenumber = req.body.phonenumber
  //var userPassword = req.body.password
  try {
    const emailandOtp = `query MyQuery {
        mst_ngo_forgot_otp(where: {phoneNumber: {_eq: "${userphonenumber}"}, otp: {_eq: "${userOtp}"}}) {
          otp
          phoneNumber
        }
      }`
    await request(endpoint, emailandOtp, null, {
      "x-hasura-admin-secret": adminSecret,
    }).then(async (data) => {
      console.log("otp", data)

      if (data.mst_ngo_forgot_otp[0] ? data.mst_ngo_forgot_otp[0].otp : "" == userOtp) {
        console.log("cominh here")
        // var hashpassword = await bcrypt.hash(userPassword, 10);
        // console.log("hash", hashpassword)
        // const updatePassword = `mutation MyMutation {
        //   update_users_many(updates: {where: {phoneNumber: {_eq: "${userphonenumber}"}}, _set: {passwordHash: "${hashpassword}"}}) {
        //     affected_rows
        //   }
        // }`
        // await request(endpoint, updatePassword, null, {
        //   "x-hasura-admin-secret": adminSecret,
        // })
        res.status(200).send({
          'Success': true, 'message': 'otp verified successfully'
        })

      }

      else {
        res.status(401).send({
          'Success': false, 'message': 'Invalid otp or phonenumber',
        })
      }
    })
  }
  catch (err) {
    console.log(err)
  }
}

exports.updatemobilepassword = async (req, res) => {
  try {
    var userPassword = req.body.password
    var userphonenumber = req.body.phonenumber
    var dataphonenumber;

    var userEmail = `query MyQuery {
        users(where: { metadata: { _contains: { phoneNumber: "${userphonenumber}" } } }) {
          metadata
        }
      }`
    await request(endpoint, userEmail, null, {
      "x-hasura-admin-secret": adminSecret,
    })
      .then(async (emaildata) => {
        dataphonenumber = emaildata
      })
    console.log("%j", dataphonenumber)

    if (dataphonenumber.users[0] ? dataphonenumber.users[0].metadata.phoneNumber : "" == userphonenumber) {
      console.log("welcome")
      var hashpassword = await bcrypt.hash(userPassword, 10);
      console.log("hash", hashpassword)
      const updatePassword = `mutation MyMutation {
    update_users_many(updates: {where: { metadata: { _contains: { phoneNumber: "${userphonenumber}" } }}, _set: {passwordHash: "${hashpassword}"}}) {
      affected_rows
    }
  }`
      await request(endpoint, updatePassword, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      res.status(200).send({
        'Success': true, 'message': 'Password updated successfully'
      })
    }
    else {
      res.status(402).send({
        'Success': false, 'message': 'Invalid phonenumber or password'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(401).send({
      'Success': false, 'message': 'Invalid password or password',
    })
  }
}

//   function sendOTP(phonenumber,otp,res) {

//  var message = client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: '2763789674',
//       to: phonenumber
//     })
//     // .then(message => {
//     //   console.log(`otp send to ${message.to}`)
//     // })
//     return message
//     .catch(error =>
//     res.status(401).send({
//       'Success': false, 'message': 'Please Enter Valid MobileNumber'
//     })
//     )
//   }




exports.paymentCompletedEmailTrigger = async (req, res) => {
  try {
    const emailTemplateSource = fs.readFileSync('./views/payment.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)
    const emaildata = {
      paid_to: req.body.paid_to,
      customer_email: req.body.customer_email,
      payment_amount: req.body.payment_amount,
      transation_id: req.body.transation_id,
      transation_status: req.body.transation_status,
      customer_name: req.body.customer_name
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
      to: req.body.customer_email,
      // cc: 'anusha@hysas.com',
      subject: 'Pocket payment details',

      html: emailHtml

    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      res.status(200).send({
        'Success': true, 'message': 'Email send successfully'
      })
    });
  }
  catch (error) {
    console.log(error)
    res.status(401).send({
      'Success': false, 'message': 'Email tigger process failure',
    })
  }
}

exports.paymentRefundEmailTrigger = async (req, res) => {
  try{
    const emailTemplateSource = fs.readFileSync('./views/amountrefund.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)
    const emaildata = {
      customer_email: req.body.customer_email,
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
      to: req.body.customer_email,
      // cc: 'anusha@hysas.com',
      subject: 'Amount refund',

      html: emailHtml

    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      res.status(200).send({
        'Success': true, 'message': 'Email send successfully'
      })
    });

  }catch(error){
    console.log(error)
  }
}

exports.reportEmailTrigger = async (req, res) => {
  
  try{
    const emailTemplateSource = fs.readFileSync('./views/report.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)
    const emaildata = {
      user_email: req.body.user_email,
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
      to: req.body.user_email,
      // cc: 'anusha@hysas.com',
      subject: 'Report submitted',

      html : emailHtml

    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      res.status(200).send({
        'Success': true, 'message': 'Email send successfully'
      })
    });

  }catch(error){
    console.log(error)
  }
}

// Quick donate sms trigger api
exports.quickDonateSms = async (req, res) => {
  try {
    var ngo_id = req.body.nog_id
    var transation_id = req.body.transation_id
    console.log("Quick", ngo_id);
    var userData = `query MyQuery {
      users(where: {id: {_eq: "${req.body.user_id}"}}) {
        metadata(path: "phoneNumber")
      }
    }
    `
    var useDetails = await request(endpoint, userData, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    var userPhonenumber = useDetails.users[0].metadata
    console.log("useDetails", userPhonenumber);
    var ngoData = `query MyQuery {
      mst__ngos(where: {id: {_eq: "${ngo_id}"}}) {
        name
      }
    }
    `
    var ngoDetails = await request(endpoint, ngoData, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    var ngoName = ngoDetails.mst__ngos[0].name
    console.log("ngos request", ngoName);
    if (req.body.transation_id) {
      var content = `Hello,you have made a successful donation to ${ngoName} . Your transaction id is ${transation_id} .Keep donating to change peoples lives. Disclaimer- If this transaction was not done by you,please report it within 24hours.`
      brevoController.sendSmsFunc(userPhonenumber, content)
      return res.status(200).send({
        'Success': true, 'message': 'Sms Send Successfully'
      })
    } else {
      var content = ` Congrats! The charity ${ngoName} you donated has reached its target! This wouldn’t be possible without your contribution. Thankyou for your generosity and we hope to see you again.`
      brevoController.sendSmsFunc(userPhonenumber, content)
      return res.status(200).send({
        'Success': true, 'message': 'Sms Send Successfully'
      })
    }

  }
  catch (error) {
    console.log(error)
    res.status(400).json({ message: error })
  }
}

// project close announcement 
exports.announcement = async (req, res) => {
  try {
    var project_id = req.body.project_id
    console.log("announcement", project_id);
    var projectData = `query MyQuery {
      mst__transactions(where: {project_id: {_eq: "${project_id}"}, _and: {payment_mode: {_eq: "ONETIME"}}}) {
        user_id
        mst__projects {
          name
        }
      }
    }
    `
    var userDataList = await request(endpoint, projectData, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    console.log("userData", userDataList);
    var projectName = userDataList.mst__transactions[0].mst__projects.name
    console.log("projectName", projectName);
    for (const userDetails of userDataList.mst__transactions) {
      var userData = `query MyQuery {
        users(where: {id: {_eq: "${userDetails.user_id}"}}) {
          metadata(path: "phoneNumber")
        }
      }
      `
      var useDetails = await request(endpoint, userData, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("success", useDetails)
      var userPhonenumber = useDetails.users[0].metadata
      var content = `We are happy to announce that the project ${projectName} has been closed. Thankyou for being an impactful role in other people’s life. `
      brevoController.sendSmsFunc(userPhonenumber, content)
    }
    return res.status(200).send({
      'Success': true, 'message': 'Sms Send Successfully'
    })
  }
  catch (error) {
    console.log(error)
    res.status(400).json({ message: error })
  }

}

exports.userDeactivatedStatus = async (req, res) => {
  console.log("coming")
  try{
    var userid =  req.body.userid;
    var email = req.body.email;
    var name = req.body.name;
    var reason = req.body.reason;
    console.log("Id",userid);
    console.log("Email", email)
console.log("Name",name);
console.log("Reason",reason)

var userData = `query MyQuery {
  users(where: {id: {_eq: "${userid}"}}) {
    disabled
  }
}`

var userStatus = await request(endpoint, userData, null, {
  "x-hasura-admin-secret": adminSecret,
})
//console.log("status",userStatus.users[0].disabled)
var newStatus = userStatus.users[0].disabled
console.log(newStatus)
if(newStatus === true){
  console.log("coming in if condition")
  brevoController.useremail(userid,email,name,reason)
  return res.status(200).send({
    'Success': true, 'message': 'Email Send Successfully'
  })
}
else if(newStatus === false){
  console.log("coming if elseif")
  brevoController.userActiveEmail(userid,email,name,reason)
  return res.status(200).send({
    'Success': true, 'message': 'Email Send Successfully'
  })
}

  }catch(error){
    console.log(error)
    res.status(400).json({ message: error })
  }
}

