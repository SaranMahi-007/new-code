
const validation = require('../middleware.js/validation/auth.validation')
const { client } = require('../client');
const { gql } = require("graphql-request");
const bcrypt = require('bcrypt');
const { generateJWT } = require('../jwt')
const { request } = require("graphql-request");
const endpoint = "https://web.pocketgiving.co.uk/v1/graphql";
const adminSecret = "AcdBFQjcVnQW987Py9785MvJ7567";
const fast2sms = require('fast-two-sms')
const otpGenerator = require("otp-generator");
var nodemailer = require("nodemailer");
const emailValidator = require('email-validator');
const fs = require("fs");
const handlebars = require("handlebars");
const firebase = require('firebase-admin');
var FCM = require('fcm-node');
const brevoController = require('./brevo.controller');

// const accDetails = {
//   "type": "service_account",
//   "project_id": "pocketsf-a05c9",
//   "private_key_id": "e8fd1b6eff5fe1ce013f6bf6a6e8e80c4cd074cd",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCfs6iD2Uov2WTC\nFFCMuNNvS6O1S6NG9SKVdG/vFqQ6JyFkpxvn8IBsCBRQebScmnImgoVsvxA7Q6yb\n+WcrmhY21GesWLThI8gxMUeFZn0/8aeB2T1njbHQmaegp3jMfh4xQI2Gg6QP1tTZ\nRa1vhSYfaQKTh2qjr7/MoebH0BoJmYWMtW4wJYxUilxWByRdYMk6/Z3wSWdG3HqV\nFy+VVU1VGfI0VoY0nQ42yfxlA214A3sKMmg3Ifml3/ufTOFv7b+as+ro3mgwyl1b\nS7FStp15FR7zWvt+059ZhLl7rzSa19mihi5Y3iwfifPKuk35awAaOY7lkonGjjZr\nBllK9pmtAgMBAAECggEAHIOKDrJ877KnrgxM/ncgjyJI8j11Q13QxTEDLEPVYimq\n6Wr5zU1wTHmb0OuN/xkHUQ9kTbCGcCJq3vVmgY8zMKp3cTrsXrdSDtBu5edQ7RoT\nL5ivQT44FZfdqU5Ff/NzphURv8bgw9A2dC2f5AW4swp/goI+3MdsHhf5Gcty3qwh\nfKSIQrGrG60EULHJ67W3RiQRp1YR8k8XPwelye6UZ9OADgpz3ewlNDgdzmpfheP1\nRynAkDjX8QQbR9KJXZa9Vi7TSESrXsAmJ3CGR+HZ2h9JXUcpxV+Ws7YIG9MIyKU7\ngi/91gvQr3S6lFiVqW7BHbkiLvMnjSLBa0r6FB5Q0QKBgQDSbWOLXjdP6VWY5PCv\nQElpIuQeDo0XjgQ2QSuSzIbFXEIHeDf09FtlVRmhGIcUcI+Q7rn3wqYiG3ruVSCB\najPgiE6WZlHCSPFhCGyksBYWiRUUh5aZODIig/d/wQv2yRoVkT+TiWj4W3f1Cy7h\nGpxkF57rDnpO2TUsPpdQB5hWcQKBgQDCSevgYC1vWUTVQbsCp0Z31yLlKaCV9sqi\nvV0dMKzrTNzMX2wRF6aQUi8eAyb2+Lqz2kjHT654NG318SZ4KXjwaAoIsfXJBu4r\nzXHCKLsaj1cQ9KKkNyTt1T7n/CuLZ9zAsc4/cm9I3H5Vjvoy66xUu2yKJIZClsqt\nqU9oq8ns/QKBgGMa5fEztHVMfeX+nWTMsEZ2Cl4lmEnptw4eb3k6HpdBNk/yTNhv\nZcQ56lI3DReRU+x8otWPtVMHAkTRjveknz42tFydYBBS7mw23YRK8nw2n9kFauZK\n00HySVTABPR8Dm7t87V22BtwaPTeCXw3XkS94zjtnqkYH7Tw3a7xhMvhAoGAf8yq\nKKR7HoRk37Zl8h/gHZJZNM6GAD8fGZ9gMYREKl8b2h9mcXPSL5qvvZkrN0dzYDzU\npK5IQG+UaTPgLyhwkgqNlxygZUR2xD9WdfXe5WCmT9PrbAON+hfMUkKwzfla3zHW\nTivTAeVwAI2VDIuzhuTmR5Qw8HpKBaOaRWrC320CgYBRtvgOt2gdgqxdfARHWxXR\nmQs84FpBJ0HgZtqV7wbokmw17Y2R9Cp43ABQRj6WNQBJzZXfDlsEk8LB7GT5SRxe\nd/ymQOTL5pPvk5kxSjo8qw6Ls58n5+qyTrj1EFGZ0frAQeVrjtAhFU+a6fJHt0cy\nXHPUSbv0pb3kPX0sdG5/kw==\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-a10cq@pocketsf-a05c9.iam.gserviceaccount.com",
//   "client_id": "106350607719247940120",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-a10cq%40pocketsf-a05c9.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }

const accDetails = {
  "type": "service_account",
  "project_id": "pockets-b5ac9",
  "private_key_id": "984a7df88ef4ad9889bd84e0df588d56eecc99b6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDVaXEgfezY1U9l\nq/1MBF4tMDh9y7s5GhEdSroj6PrBNlokXK86GeW6zPVhk7Pj/noopCeDcHj3ECLN\n+QBVtaWuWKrFVpqcOPsxxlH9HUouErvh0UZjgj/Q7yrZ2SKqvq9FVnrIk58zUDBJ\n8dSD6P9Xy/qN+JsbAjZJ/PYcVrRsePNhFTdffSDyTEPy/hbp276/U6/vz2ZS22D5\nLuoYPHOrHEMFU6TnCbRtloC5t1Yc8qd4aTwinXDKTZ+p/hBBqYBUHTPIKjf3jS9F\n3TwoIQS+/dTDcB28mbPNpPRhUFhCcCthzE1uCvEsnMDyS2xGfucgPtKbAjaWigoe\nOrTF/oZPAgMBAAECggEAAPnPc5zqdVSxspRRFITnQquixn3PqFjZ1S7J9RoT83Li\ngfdj3GR77BkTJ367vCzQtYOH+WONRLaagiNDq3X+K52U16bSuX4lNTq5QJVes8vl\nd13emtvgm32hzjHeT7Y5f5v/9GTVvdqoWIjg4OLdhV2VvV/H+HKlJDzM30pM3uYY\ni1jtmqnWjuxo2xrwOnBC6saqFtMlpZY0c2KLuvaIzB3IRTHiXJs8tBWt1Fm44zKz\ntPRo3n6E2PpmYdhZXwO+9t8vE8WJ3NEh6yH7GNaL9Kt/dKDTX+KXtjVa5gra6mOs\nUBteKHEdI/R1Z1r21+gjindblvdYUNYX690Ymf+HEQKBgQDwsS5eH7Vs2nUOLR66\nmJ9SALejZbXqT81DsBD6BaOkObUu6W8UaOOW9/kJKcIgrTniT/TM20k/8jWsQ9Lk\nJevn8M/GJzG4hjkkdZyLbk1g4J5wvpLQ9TagW981haSJkqp58hu8OLrdXGUbGVPW\nYi/tEPudhp56s2VPHPR8vz8G5wKBgQDi/BlK7tCgXRCirmnBFd9J+MYGJDz2HfMH\ntZ0gnedTBCD7WrFmyIeF+fymhc3+QsulRfht79xMnF36l/JR9KDaNZ00bgrAEIOJ\n4AAjWrx3Qspag6Cku3SBiDYieDcXYGP9XuB3LEDFuusGilfzHmo3VfhEdvj+FOls\nKbIH0j3gWQKBgCEPlVjkbh03nKCH3hKvaCLxakgNboFy2LUVeB9/qsyiCJsbAWEC\nT1CrWw/BJqMqaCsH5I5HCLa55Fl3L36bHt5LG58SPygjd7HkXc5hJkvKTrkZ1DzT\nkd9Q/0Xwx3sGJFh/wwOFn1VMna6tOfDWp9KeZJFsrlQYVDAbwBFqi5O9AoGAR1Dr\n5XY5SFlVM7fW9FqZ6FToat+R48YvKJnwP2I9XwDqF+87085nfjm4Ht3lheCYuVnN\nn0UAk3WBtY1uDj/tFgJIXUPBzuyhV31wrasBkfsDNwMqQve+uEACujvJG2gmomHf\n5rGZvEZpN4nZ7kH9H1u8gE5dFv+dA2XqULjGxikCgYBVT3yl/5/eghM5EQ0X3Z/N\nXf00/lCU81CVTm73T+rtup8CQpH8qElHxg0MyB3Sdwkjterwbos4ZHYA5vhwBSqF\nm4+pLtfCuTCxMio6qGd3fQIytz7rc5bEE08OcCNTLbgRd734BZf7Sn6aQlOuXhTF\nbqivjoO5ngWLM/tASinudg==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-k3faa@pockets-b5ac9.iam.gserviceaccount.com",
  "client_id": "114714803873853409176",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k3faa%40pockets-b5ac9.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


firebase.initializeApp({
  credential: firebase.credential.cert(accDetails)
});

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
  console.log("body", bodyPassword)
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
      if (req.body.email === "admin@pockets.com" || req.body.email === "admin@pocketgiving.co.uk") {
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
        // emailtrigger(bodyPassword, bodyEmail, bodyName)
        brevoController.emailtrigger(bodyPassword, bodyEmail, bodyName)



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
        // emailtrigger(bodyPassword, bodyEmail, bodyName)
        
     var returndata = brevoController.emailtrigger(bodyPassword, bodyEmail, bodyName)
     console.log("controler ",returndata)
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

// const emailtrigger = (bodyPassword, bodyEmail, bodyName) => {
//   const emailTemplateSource = fs.readFileSync('./views/email.handlebars', "utf8");
//   const emailTemplate = handlebars.compile(emailTemplateSource)
//   const emaildata = {
//     user: bodyName,
//     Username: bodyName,
//     Email: bodyEmail,
//     Password: bodyPassword
//   }
//   //res.render('payment.handlebars',emaildata)
//   const emailHtml = emailTemplate(emaildata);
//   console.log(emailHtml)
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'vinsoftuser@gmail.com',
//       pass: 'uvfbnxeiehrycrgg'
//     }
//   });
//   var mailOptions = {

//     from: 'vinsoftuser@gmail.com',
//     to: bodyEmail,
//     subject: 'Account created successfully',
//     //text: `Your confirmation OTP is ${otp}`,
//     html: emailHtml

//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//     res.status(200).send({
//       'Success': true, 'message': 'Email and OTP send successfully'
//     })
//   });

// }

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
  if (req.body.email === "admin@pockets.com" || req.body.email === "admin@pocketgiving.co.uk") {
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
  else if (req.body.email != "admin@pockets.com" || req.body.email != "admin@pocketgiving.co.uk") {
    console.log("not welcome to login")
    if (passwordMatch) {
      console.log("vanakam", passwordMatch)
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

        var textmessage = `Your confirmation OTP is ${generateOtp}`
        var subject = 'Forgot Password'
        brevoController.sendEmailbrevo(emailID, textmessage, subject)




        // var transporter = nodemailer.createTransport({
        //   service: 'gmail',
        //   auth: {
        //     user: 'vinsoftuser@gmail.com',
        //     pass: 'uvfbnxeiehrycrgg'
        //   }
        // });
        // var mailOptions = {

        //   from: 'vinsoftuser@gmail.com',
        //   to: emailID,
        //   subject: 'Forgot Password',
        //   text: `Your confirmation OTP is ${generateOtp}`,

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
        res.status(200).send({
          'Success': true, 'message': 'Email and OTP send successfully'
        })
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

exports.confirmpassword = async (req, res) => {
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
        console.log("", decryptpassword)
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

exports.usernotificationTaggle = async (req, res) => {
  //console.log(req.body.ngo_id)
  try {
    if (req.body.event.op == "INSERT") {
      var ngoid = req.body.event.data.new.ngo_id
      const ngoname = `query MyQuery {
  mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
    name
  }
}`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name
      const userdetails = `query MyQuery {
          map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
            follower_id
          }
        }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log(userId.map_user_follow[0].follower_id)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        //console.log(userloopingID)
        const notificationstatus = `query MyQuery {
            mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
              project_notification
              preference
              ngo_id
              project_id
            }
          }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus)
        if (projectStatus.mst_notification_preference.length === 0) {
          console.log("coming to empty part")
        }
        //console.log("looping data",projectStatus.mst_notification_preference)
        for (j of projectStatus.mst_notification_preference) {
          console.log("vanthuden", j.preference)
          console.log("vanthuden", j.project_notification)
          if (ngoid === j.ngo_id) {
            if (j.preference === 'NGO') {
              console.log("ngo!!!")
              if (j.project_notification === true) {
                console.log("saran")
                const notificationData = `query MyQuery {
                  mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                    notification_token
                  }
                }`
                var notificationStatus = await request(endpoint, notificationData, null, {
                  "x-hasura-admin-secret": adminSecret,
                })
                console.log("coming notification part", notificationStatus)
                for (k of notificationStatus.mst_notification_token) {
                  //console.log(k.notification_token)
                  var devicetoken = k.notification_token
                  var noftication = `New project uk charity has been created by ${nameOfcharity}`
                  await sendNotificationEvenetCreation(devicetoken, noftication)
                }

              }
              else if (j.project_notification === false) {
                console.log("false is coming")
              }
            }
          }
          else if (j.preference === 'Project') {
            const checkid = `query MyQuery {
                mst__projects(where: {ngo_id: {_eq: "${ngoid}"}}) {
                  name
                  id
                }
              }`
            var notificationStatus = await request(endpoint, checkid, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            console.log("welcome is", notificationStatus.mst__projects[0].id)
            for (l of notificationStatus.mst__projects) {
              console.log("loop id is", l.id)
              var projectName = l.name
              if (j.project_id === l.id) {
                if (j.project_notification == true) {
                  console.log("else is is working in true part")
                  const notificationData = `query MyQuery {
                  mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                    notification_token
                  }
                }`
                  var notificationStatus = await request(endpoint, notificationData, null, {
                    "x-hasura-admin-secret": adminSecret,
                  })
                  console.log("coming notification part", notificationStatus)
                  for (k of notificationStatus.mst_notification_token) {
                    //console.log(k.notification_token)
                    var devicetoken = k.notification_token
                    var noftication = `New project uk charity has been created by ${projectName}`
                    await sendNotificationEvenetCreation(devicetoken, noftication)
                  }
                  res.json({
                    message: "done",
                    
                })
                }
                else if (j.project_notification == false) {
                  console.log("false is working")
                }

              }
            }
          }

        }

      }

    }
    else if (req.body.event.op == "UPDATE") {
      console.log("saran")
      var ngoid = req.body.event.data.new.ngo_id
      const ngoname = `query MyQuery {
mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
name
}
}`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name
      const userdetails = `query MyQuery {
      map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
        follower_id
      }
    }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log(userId.map_user_follow[0].follower_id)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        //console.log(userloopingID)
        const notificationstatus = `query MyQuery {
        mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
          project_notification
          preference
          ngo_id
          project_id
        }
      }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus)
        if (projectStatus.mst_notification_preference.length === 0) {
          console.log("coming to empty part")
        }
        //console.log("looping data",projectStatus.mst_notification_preference)
        for (j of projectStatus.mst_notification_preference) {
          console.log("vanthuden", j.preference)
          console.log("vanthuden", j.project_notification)
          if (ngoid === j.ngo_id) {
            if (j.preference === 'NGO') {
              console.log("ngo!!!")
              if (j.project_notification === true) {
                console.log("saran")
                const notificationData = `query MyQuery {
              mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                notification_token
              }
            }`
                var notificationStatus = await request(endpoint, notificationData, null, {
                  "x-hasura-admin-secret": adminSecret,
                })
                console.log("coming notification part", notificationStatus)
                for (k of notificationStatus.mst_notification_token) {
                  //console.log(k.notification_token)
                  var devicetoken = k.notification_token
                  var noftication = `Project ${projectName} has been updated by charity ${nameOfcharity}`
                  await sendNotificationEvenetCreation(devicetoken, noftication)
                }

              }
              else if (j.project_notification === false) {
                console.log("false is coming")
              }
            }
          }
          else if (j.preference === 'Project') {
            const checkid = `query MyQuery {
            mst__projects(where: {ngo_id: {_eq: "${ngoid}"}}) {
              name
              id
            }
          }`
            var notificationStatus = await request(endpoint, checkid, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            console.log("welcome is", notificationStatus.mst__projects[0].id)
            for (l of notificationStatus.mst__projects) {
              console.log("loop id is", l.id)
              projectName = l.name
              if (j.project_id === l.id) {
                if (j.project_notification == true) {
                  console.log("else is is working in true part")
                  const notificationData = `query MyQuery {
              mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                notification_token
              }
            }`
                  var notificationStatus = await request(endpoint, notificationData, null, {
                    "x-hasura-admin-secret": adminSecret,
                  })
                  console.log("coming notification part", notificationStatus)
                  for (k of notificationStatus.mst_notification_token) {
                    //console.log(k.notification_token)
                    var devicetoken = k.notification_token
                    var noftication = `Project ${projectName} has been updated by charity ${nameOfcharity}`
                    await sendNotificationEvenetCreation(devicetoken, noftication)
                  }
                }
                else if (j.project_notification == false) {
                  console.log("false is working")
                }

              }
            }
          }

        }

      }

    }
    else if (req.body.event.op == "DELETE") {
      var ngoid = req.body.event.data.old.ngo_id
      const ngoname = `query MyQuery {
mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
name
}
}`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name
      const userdetails = `query MyQuery {
    map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
      follower_id
    }
  }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log(userId.map_user_follow[0].follower_id)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        //console.log(userloopingID)
        const notificationstatus = `query MyQuery {
      mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
        project_notification
        preference
        ngo_id
        project_id
      }
    }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus)
        if (projectStatus.mst_notification_preference.length === 0) {
          console.log("coming to empty part")
        }
        //console.log("looping data",projectStatus.mst_notification_preference)
        for (j of projectStatus.mst_notification_preference) {
          console.log("vanthuden", j.preference)
          console.log("vanthuden", j.project_notification)
          if (ngoid === j.ngo_id) {
            if (j.preference === 'NGO') {
              console.log("ngo!!!")
              if (j.project_notification === true) {
                console.log("saran")
                const notificationData = `query MyQuery {
            mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
              notification_token
            }
          }`
                var notificationStatus = await request(endpoint, notificationData, null, {
                  "x-hasura-admin-secret": adminSecret,
                })
                console.log("coming notification part", notificationStatus)
                for (k of notificationStatus.mst_notification_token) {
                  //console.log(k.notification_token)
                  var devicetoken = k.notification_token
                  var noftication = `Project ${projectName} has been removed by charity ${nameOfcharity}`
                  await sendNotificationEvenetCreation(devicetoken, noftication)
                }

              }
              else if (j.project_notification === false) {
                console.log("false is coming")
              }
            }
          }
          else if (j.preference === 'Project') {
            const checkid = `query MyQuery {
          mst__projects(where: {ngo_id: {_eq: "${ngoid}"}}) {
            name
            id
          }
        }`
            var notificationStatus = await request(endpoint, checkid, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            console.log("welcome is", notificationStatus.mst__projects[0].id)
            for (l of notificationStatus.mst__projects) {
              console.log("loop id is", l.id)
              projectName = l.name
              if (j.project_id === l.id) {
                if (j.project_notification == true) {
                  console.log("else is is working in true part")
                  const notificationData = `query MyQuery {
            mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
              notification_token
            }
          }`
                  var notificationStatus = await request(endpoint, notificationData, null, {
                    "x-hasura-admin-secret": adminSecret,
                  })
                  console.log("coming notification part", notificationStatus)
                  for (k of notificationStatus.mst_notification_token) {
                    //console.log(k.notification_token)
                    var devicetoken = k.notification_token
                    var noftication = `Project ${projectName} has been removed by charity ${nameOfcharity}`
                    await sendNotificationEvenetCreation(devicetoken, noftication)
                  }
                }
                else if (j.project_notification == false) {
                  console.log("false is working")
                }

              }
            }
          }

        }

      }

    }
  } catch (error) {
    console.log(error)
  }

}

exports.userpostNotification = async (req, res) => {
  //console.log("new post",req.body.event.data.new)
  if (req.body.event.op == "INSERT") {
    var ngoid = req.body.event.data.new.ngo_id
    var title = req.body.event.data.new.title
    const ngoname = `query MyQuery {
mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
name
}
}`
    var charityName = await request(endpoint, ngoname, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    console.log("charity name", charityName.mst__ngos[0].name)
    var nameOfcharity = charityName.mst__ngos[0].name
    const userdetails = `query MyQuery {
      map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
        follower_id
      }
    }`
    var userId = await request(endpoint, userdetails, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    //console.log(userId.map_user_follow[0].follower_id)
    for (i of userId.map_user_follow) {
      var userloopingID = i.follower_id
      //console.log(userloopingID)
      const notificationstatus = `query MyQuery {
        mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
          post_notification
          preference
          ngo_id
          project_id

        }
      }`
      var projectStatus = await request(endpoint, notificationstatus, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log("status",projectStatus)
      // if(projectStatus. mst_notification_preference.length === 0){
      //   console.log("coming to empty part")
      // }
      console.log("looping data", projectStatus)
      for (j of projectStatus.mst_notification_preference) {
        console.log("vanthuden", j.preference)
        console.log("vanthuden", j.post_notification)
        if (ngoid === j.ngo_id) {
          if (j.preference === 'NGO') {
            console.log("ngo!!!")
            if (j.post_notification === true) {
              console.log("saran")
              const notificationData = `query MyQuery {
              mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                notification_token
              }
            }`
              var notificationStatus = await request(endpoint, notificationData, null, {
                "x-hasura-admin-secret": adminSecret,
              })
              console.log("coming notification part", notificationStatus)
              for (k of notificationStatus.mst_notification_token) {
                //console.log(k.notification_token)
                var devicetoken = k.notification_token
                var noftication = `New Post ${title} has been created by charity ${nameOfcharity}`
                await sendNotificationEvenetCreation(devicetoken, noftication)
              }

            }
            else if (j.post_notification === false) {
              console.log("false is coming")
            }
          }
        }
        else if (j.preference === 'Project') {
          const checkid = `query MyQuery {
            mst__projects(where: {ngo_id: {_eq: "${ngoid}"}}) {
              name
              id
            }
          }`
          var notificationStatus = await request(endpoint, checkid, null, {
            "x-hasura-admin-secret": adminSecret,
          })
          console.log("welcome is", notificationStatus.mst__projects[0].id)
          for (l of notificationStatus.mst__projects) {
            var projectName = l.name
            if (l.id === j.project_id) {
              if (j.post_notification == true) {
                console.log("else is is working in true part")
                const notificationData = `query MyQuery {
              mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                notification_token
              }
            }`
                var notificationStatus = await request(endpoint, notificationData, null, {
                  "x-hasura-admin-secret": adminSecret,
                })
                console.log("coming notification part", notificationStatus)
                for (k of notificationStatus.mst_notification_token) {
                  //console.log(k.notification_token)
                  var devicetoken = k.notification_token
                  var noftication = `New Post ${title} has been created by charity ${projectName}`
                  await sendNotificationEvenetCreation(devicetoken, noftication)
                }
              }
              else if (j.post_notification == false) {
                console.log("false is working")
              }
            }
          }
        }
      }

    }

  }
  else if (req.body.event.op == "UPDATE") {
    var ngoid = req.body.event.data.new.ngo_id
    var title = req.body.event.data.new.title
    const ngoname = `query MyQuery {
mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
name
}
}`
    var charityName = await request(endpoint, ngoname, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    console.log("charity name", charityName.mst__ngos[0].name)
    var nameOfcharity = charityName.mst__ngos[0].name
    const userdetails = `query MyQuery {
    map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
      follower_id
    }
  }`
    var userId = await request(endpoint, userdetails, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    //console.log(userId.map_user_follow[0].follower_id)
    for (i of userId.map_user_follow) {
      var userloopingID = i.follower_id
      //console.log(userloopingID)
      const notificationstatus = `query MyQuery {
      mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
        post_notification
        preference
        ngo_id
        project_id

      }
    }`
      var projectStatus = await request(endpoint, notificationstatus, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log("status",projectStatus)
      // if(projectStatus. mst_notification_preference.length === 0){
      //   console.log("coming to empty part")
      // }
      console.log("looping data", projectStatus)
      for (j of projectStatus.mst_notification_preference) {
        console.log("vanthuden", j.preference)
        console.log("vanthuden", j.post_notification)
        if (ngoid === j.ngo_id) {
          if (j.preference === 'NGO') {
            console.log("ngo!!!")
            if (j.post_notification === true) {
              console.log("saran")
              const notificationData = `query MyQuery {
            mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
              notification_token
            }
          }`
              var notificationStatus = await request(endpoint, notificationData, null, {
                "x-hasura-admin-secret": adminSecret,
              })
              console.log("coming notification part", notificationStatus)
              for (k of notificationStatus.mst_notification_token) {
                //console.log(k.notification_token)
                var devicetoken = k.notification_token
                var noftication = `Post ${title} has been updated by charity ${nameOfcharity}`
                await sendNotificationEvenetCreation(devicetoken, noftication)
              }

            }
            else if (j.post_notification === false) {
              console.log("false is coming")
            }
          }
        }
        else if (j.preference === 'Project') {
          const checkid = `query MyQuery {
          mst__projects(where: {ngo_id: {_eq: "${ngoid}"}}) {
            name
            id
          }
        }`
          var notificationStatus = await request(endpoint, checkid, null, {
            "x-hasura-admin-secret": adminSecret,
          })
          console.log("welcome is", notificationStatus.mst__projects[0].id)
          for (l of notificationStatus.mst__projects) {
            var projectName = l.name
            if (l.id === j.project_id) {
              if (j.post_notification == true) {
                console.log("else is is working in true part")
                const notificationData = `query MyQuery {
            mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
              notification_token
            }
          }`
                var notificationStatus = await request(endpoint, notificationData, null, {
                  "x-hasura-admin-secret": adminSecret,
                })
                console.log("coming notification part", notificationStatus)
                for (k of notificationStatus.mst_notification_token) {
                  //console.log(k.notification_token)
                  var devicetoken = k.notification_token
                  var noftication = `Post ${title} has been updated by charity ${projectName}`
                  await sendNotificationEvenetCreation(devicetoken, noftication)
                }
              }
              else if (j.post_notification == false) {
                console.log("false is working")
              }
            }
          }
        }
      }

    }

  }

  else if (req.body.event.op == "DELETE") {
    var ngoid = req.body.event.data.old.ngo_id
    var title = req.body.event.data.old.titlee
    const ngoname = `query MyQuery {
mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
name
}
}`
    var charityName = await request(endpoint, ngoname, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    console.log("charity name", charityName.mst__ngos[0].name)
    var nameOfcharity = charityName.mst__ngos[0].name
    const userdetails = `query MyQuery {
    map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
      follower_id
    }
  }`
    var userId = await request(endpoint, userdetails, null, {
      "x-hasura-admin-secret": adminSecret,
    })
    //console.log(userId.map_user_follow[0].follower_id)
    for (i of userId.map_user_follow) {
      var userloopingID = i.follower_id
      //console.log(userloopingID)
      const notificationstatus = `query MyQuery {
      mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
        post_notification
        preference
        ngo_id
        project_id

      }
    }`
      var projectStatus = await request(endpoint, notificationstatus, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log("status",projectStatus)
      // if(projectStatus. mst_notification_preference.length === 0){
      //   console.log("coming to empty part")
      // }
      console.log("looping data", projectStatus)
      for (j of projectStatus.mst_notification_preference) {
        console.log("vanthuden", j.preference)
        console.log("vanthuden", j.post_notification)
        if (ngoid === j.ngo_id) {
          if (j.preference === 'NGO') {
            console.log("ngo!!!")
            if (j.post_notification === true) {
              console.log("saran")
              const notificationData = `query MyQuery {
            mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
              notification_token
            }
          }`
              var notificationStatus = await request(endpoint, notificationData, null, {
                "x-hasura-admin-secret": adminSecret,
              })
              console.log("coming notification part", notificationStatus)
              for (k of notificationStatus.mst_notification_token) {
                //console.log(k.notification_token)
                var devicetoken = k.notification_token
                var noftication = `Post ${title} has been removed by charity ${nameOfcharity}`
                await sendNotificationEvenetCreation(devicetoken, noftication)
              }

            }
            else if (j.post_notification === false) {
              console.log("false is coming")
            }
          }
        }
        else if (j.preference === 'Project') {
          const checkid = `query MyQuery {
          mst__projects(where: {ngo_id: {_eq: "${ngoid}"}}) {
            name
            id
          }
        }`
          var notificationStatus = await request(endpoint, checkid, null, {
            "x-hasura-admin-secret": adminSecret,
          })
          console.log("welcome is", notificationStatus.mst__projects[0].id)
          for (l of notificationStatus.mst__projects) {
            var projectName = l.name
            if (l.id === j.project_id) {
              if (j.post_notification == true) {
                console.log("else is is working in true part")
                const notificationData = `query MyQuery {
            mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
              notification_token
            }
          }`
                var notificationStatus = await request(endpoint, notificationData, null, {
                  "x-hasura-admin-secret": adminSecret,
                })
                console.log("coming notification part", notificationStatus)
                for (k of notificationStatus.mst_notification_token) {
                  //console.log(k.notification_token)
                  var devicetoken = k.notification_token
                  var noftication = `Post ${title} has been removed by charity ${projectName}`
                  await sendNotificationEvenetCreation(devicetoken, noftication)
                }
              }
              else if (j.post_notification == false) {
                console.log("false is working")
              }
            }
          }
        }
      }

    }

  }


}

exports.userpostLikeNotification = async (req, res) => {
  //console.log("req", req.body.event.data.new)
  try {
    if (req.body.event.op == "INSERT") {
      //var ngoid =req.body.ngo_id
      var userId = req.body.event.data.new.id
      const postid = `query MyQuery {
        mst_post_like(where: {id: {_eq: "${userId}"}}) {
          mst_post {
            ngo_id
          }
        }
      }`
      var charityName = await request(endpoint, postid, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log("%j",charityName.mst_post_like[0].mst_post)
      //var ngoID = charityName.mst_post_like[0].mst_post.ngo_id
      //console.log("ne ngoid",ngoID)
      var ngoid = charityName.mst_post_like[0].mst_post.ngo_id
      const ngoname = `query MyQuery {
        mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
        name
        }
        }`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name

      const userdetails = `query MyQuery {
          map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
            follower_id
          }
        }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("id", userId)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        console.log(userloopingID)
        const notificationstatus = `query MyQuery {
            mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
              post_notification
              preference
              ngo_id
              project_id
            }
          }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus)
        // if(projectStatus. mst_notification_preference.length === 0){
        //   console.log("coming to empty part")
        // }
        console.log("looping data", projectStatus)
        for (j of projectStatus.mst_notification_preference) {
          console.log("vanthuden", j.preference)
          console.log("vanthuden", j.post_notification)
          console.log("vanthuden", j.ngo_id)
          console.log("vanthuden id is", j.project_id)
          if (ngoid === j.ngo_id || j.ngo_id === null) {
            console.log("sathish is ")
            if (j.preference === 'NGO') {
              console.log("ngo!!!")
              if (j.post_notification === true) {
                console.log("saran")
                const notificationData = `query MyQuery {
                  mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                    notification_token
                  }
                }`
                var notificationStatus = await request(endpoint, notificationData, null, {
                  "x-hasura-admin-secret": adminSecret,
                })
                console.log("coming notification part", notificationStatus)
                for (k of notificationStatus.mst_notification_token) {
                  //console.log(k.notification_token)
                  var devicetoken = k.notification_token
                  var noftication = `New post UK Charity has been liked by ${nameOfcharity}`
                  await sendNotificationEvenetCreation(devicetoken, noftication)
                }

              }
              else if (j.post_notification === false) {
                console.log("false is coming")
              }
            }
            else if (j.preference === 'Project') {
              const checkid = `query MyQuery {
                mst__projects(where: {ngo_id: {_eq: "${ngoid}"}}) {
                  name
                  id
                }
              }`
              var notificationStatus = await request(endpoint, checkid, null, {
                "x-hasura-admin-secret": adminSecret,
              })
              console.log("welcome is", notificationStatus.mst__projects[0].id)
              for (l of notificationStatus.mst__projects) {
                console.log("loop id is", l.id)

                const projectName = l.name
                if (j.project_id === l.id) {
                  if (j.post_notification == true) {
                    console.log("else is is working in true part")
                    const notificationData = `query MyQuery {
                  mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                    notification_token
                  }
                }`
                    var notificationStatus = await request(endpoint, notificationData, null, {
                      "x-hasura-admin-secret": adminSecret,
                    })
                    console.log("coming notification part", notificationStatus)
                    for (k of notificationStatus.mst_notification_token) {
                      //console.log(k.notification_token)
                      var devicetoken = k.notification_token
                      var noftication = `New post UK Charity has been liked by ${projectName}`
                      await sendNotificationEvenetCreation(devicetoken, noftication)
                    }
                  }
                  else if (j.post_notification == false) {
                    console.log("false is working")
                  }
                }
              }
            }
          }
          else if (ngoid != j.ngo_id) {
            console.log("not working")
          }
        }

      }
    }
  } catch (error) {
    console.log(error)
  }
}

exports.userRepostNotification = async (req, res) => {
  //console.log("req.body",req.body)
  try {
    if (req.body.event.op == "INSERT") {
      var id = req.body.event.data.new.id
      console.log("id", id)
      const userName = `query MyQuery {
        mst_repost(where: {id: {_eq: "b6af724b-0562-46f0-b6bd-827e0f5a50c4"}}) {
          posts {
            title
            ngo_id
          }
        }
      }
    `;
      var ngoid = await request(endpoint, userName, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("%J", ngoid.mst_repost[0].posts.ngo_id)
      var ngoId = ngoid.mst_repost[0].posts.ngo_id
      var newtitle = ngoid.mst_repost[0].posts.title
      const ngoname = `query MyQuery {
      mst__ngos(where: {id: {_eq: "${ngoId}"}}) {
      name
      }
      }`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name
      const userdetails = `query MyQuery {
        map_user_follow(where: {followee_id: {_eq: "${ngoId}"}}) {
          follower_id
        }
      }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log("userid",userId)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        console.log("userid", userloopingID)
        const notificationstatus = `query MyQuery {
          mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
            repost_notification
            preference
            project_id
  
          }
        }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus)
        for (j of projectStatus.mst_notification_preference) {
          console.log("vanthuden", j.preference)
          console.log("vanthuden", j.repost_notification)
          console.log("project id is", j.project_id)
          if (j.preference === 'Project') {
            const checkid = `query MyQuery {
              mst__projects(where: {ngo_id: {_eq: "${ngoId}"}}) {
                name
                id
              }
            }`
            var notificationStatus = await request(endpoint, checkid, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            //console.log("welcome is",notificationStatus. mst__projects)
            for (l of notificationStatus.mst__projects) {
              //console.log("loop id is",l.id)
              //console.log("the name is",l.name)
              var projectName = l.name
              if (l.id === j.project_id) {
                if (j.repost_notification === true) {
                  console.log("else is is working in true part")
                  const notificationData = `query MyQuery {
                mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
                  notification_token
                }
              }`
                  var notificationStatus = await request(endpoint, notificationData, null, {
                    "x-hasura-admin-secret": adminSecret,
                  })
                  console.log("coming notification part", notificationStatus)
                  for (k of notificationStatus.mst_notification_token) {
                    //console.log(k.notification_token)
                    var devicetoken = k.notification_token
                    var noftication = `New repost ${newtitle} created by ${projectName}`
                    await sendNotificationEvenetCreation(devicetoken, noftication)
                  }
                  res.json({
                    message: "done",
                    
                })
                }
                else if (j.repost_notification == false) {
                  console.log("false is working")
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

exports.userCommentsNotification = async (req, res) => {
  try {
    //console.log("comment section",req.body.event.data.new)
    if (req.body.event.op == 'INSERT') {
      var userID = req.body.event.data.new.id;
      const userName = `query MyQuery {
    mnt__comments(where: {id: {_eq: "${userID}"}}) {
      mst_post {
        ngo_id
        title
      }
    }
  }`;
      var ngoid = await request(endpoint, userName, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("%j", ngoid.mnt__comments[0].mst_post.ngo_id)
      var ngoID = ngoid.mnt__comments[0].mst_post.ngo_id
      var title = ngoid.mnt__comments[0].mst_post.title
      console.log("id", ngoID)
      //var ngoid = req.body.ngoid
      const ngoname = `query MyQuery {
  mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
  name
  }
  }`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name
      console.log(nameOfcharity)
      const userdetails = `query MyQuery {
    map_user_follow(where: {followee_id: {_eq: "${ngoID}"}}) {
      follower_id
    }
  }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log("id",userId)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        console.log(userloopingID)
        const notificationstatus = `query MyQuery {
      mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
       post_notification
        preference
        project_id

      }
    }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus.mst_notification_preference)
        for (j of projectStatus.mst_notification_preference) {
          //console.log("vanthuden",j.preference)
          //console.log("vanthuden",j.post_notification)
          console.log("project id is", j.project_id)
          if (j.preference === 'Project') {
            console.log("vanthuruchu")
            const checkid = `query MyQuery {
    mst__projects(where: {ngo_id: {_eq: "${ngoID}"}}) {
      name
      id
    }
  }`
            var notificationStatus = await request(endpoint, checkid, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            console.log("welcome is", notificationStatus.mst__projects[0].id)
            for (l of notificationStatus.mst__projects) {
              console.log("loop id is", l.id)

              const projectName = l.name
              if (j.project_id === l.id) {
                if (j.post_notification === true) {
                  console.log("else is is working in true part")
                  const notificationData = `query MyQuery {
      mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
        notification_token
      }
    }`
                  var notificationStatus = await request(endpoint, notificationData, null, {
                    "x-hasura-admin-secret": adminSecret,
                  })
                  console.log("coming notification part", notificationStatus)
                  for (k of notificationStatus.mst_notification_token) {
                    //console.log(k.notification_token)
                    var devicetoken = k.notification_token
                    var noftication = `New post ${title} comment by ${projectName}`
                    await sendNotificationEvenetCreation(devicetoken, noftication)
                  }
                  res.json({
                    message: "Success",
                    
                })
                }
                else if (j.post_notification == false) {
                  console.log("false is working")
                }
              }
            }
          }
        }
      }
    }
    else if (req.body.event.op == 'UPDATE') {
      var userID = req.body.event.data.new.id;
      const userName = `query MyQuery {
      mnt__comments(where: {id: {_eq: "${userID}"}}) {
        mst_post {
          ngo_id
          title
        }
      }
    }`;
      var ngoid = await request(endpoint, userName, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("%j", ngoid.mnt__comments[0].mst_post.ngo_id)
      var ngoID = ngoid.mnt__comments[0].mst_post.ngo_id
      var title = ngoid.mnt__comments[0].mst_post.title
      console.log("id", ngoID)
      //var ngoid = req.body.ngoid
      const ngoname = `query MyQuery {
    mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
    name
    }
    }`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name
      console.log(nameOfcharity)
      const userdetails = `query MyQuery {
      map_user_follow(where: {followee_id: {_eq: "${ngoID}"}}) {
        follower_id
      }
    }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("id",userId)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        //console.log("loopping id",userloopingID)
        const notificationstatus = `query MyQuery {
        mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
         post_notification
          preference
          project_id
  
        }
      }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus.mst_notification_preference)
        for (j of projectStatus.mst_notification_preference) {
          //console.log("vanthuden",j.preference)
          console.log("vanthuden",j.post_notification)
          console.log("project id is", j.project_id)
          if (j.preference === 'Project') {
            console.log("vanthuruchu")
            const checkid = `query MyQuery {
      mst__projects(where: {ngo_id: {_eq: "${ngoID}"}}) {
        name
        id
      }
    }`
            var notificationStatus = await request(endpoint, checkid, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            console.log("welcome is", notificationStatus.mst__projects[0].id)
            for (l of notificationStatus.mst__projects) {
              console.log("loop id is", l.id)

              const projectName = l.name
              console.log("name",projectName)
              if (j.project_id === l.id) {
                console.log("true is come")
                if (j.post_notification === true) {
                  console.log("else is is working in true part")
                  const notificationData = `query MyQuery {
        mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
          notification_token
        }
      }`
                  var notificationStatus = await request(endpoint, notificationData, null, {
                    "x-hasura-admin-secret": adminSecret,
                  })
                  console.log("coming notification part", notificationStatus)
                  for (k of notificationStatus.mst_notification_token) {
                    console.log("token",k.notification_token)
                    var devicetoken = k.notification_token
                    var noftication = `New  post ${title} comment is updated by ${projectName}`
                    await sendNotificationEvenetCreation(devicetoken, noftication)
                  }
                  res.json({
                    message: "Success",
                    
                })
                }
                else if (j.post_notification == false) {
                  console.log("false is working")
                }
              }
            }
          }
        }
      }
    }

    else if (req.body.event.op == 'DELETE') {
      var userID = req.body.event.data.old.id;
      const userName = `query MyQuery {
      mnt__comments(where: {id: {_eq: "${userID}"}}) {
        mst_post {
          ngo_id
        }
      }
    }`;
      var ngoid = await request(endpoint, userName, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("%j", ngoid.mnt__comments[0].mst_post.ngo_id)
      var ngoID = ngoid.mnt__comments[0].mst_post.ngo_id
      console.log("id", ngoID)
      //var ngoid = req.body.ngoid
      const ngoname = `query MyQuery {
    mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
    name
    }
    }`
      var charityName = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("charity name", charityName.mst__ngos[0].name)
      var nameOfcharity = charityName.mst__ngos[0].name
      console.log(nameOfcharity)
      const userdetails = `query MyQuery {
      map_user_follow(where: {followee_id: {_eq: "${ngoID}"}}) {
        follower_id
      }
    }`
      var userId = await request(endpoint, userdetails, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      //console.log("id",userId)
      for (i of userId.map_user_follow) {
        var userloopingID = i.follower_id
        console.log(userloopingID)
        const notificationstatus = `query MyQuery {
        mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
         post_notification
          preference
          project_id
  
        }
      }`
        var projectStatus = await request(endpoint, notificationstatus, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        //console.log("status",projectStatus.mst_notification_preference)
        for (j of projectStatus.mst_notification_preference) {
          //console.log("vanthuden",j.preference)
          //console.log("vanthuden",j.post_notification)
          console.log("project id is", j.project_id)
          if (j.preference === 'Project') {
            console.log("vanthuruchu")
            const checkid = `query MyQuery {
      mst__projects(where: {ngo_id: {_eq: "${ngoID}"}}) {
        name
        id
      }
    }`
            var notificationStatus = await request(endpoint, checkid, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            console.log("welcome is", notificationStatus.mst__projects[0].id)
            for (l of notificationStatus.mst__projects) {
              console.log("loop id is", l.id)

              const projectName = l.name
              if (j.project_id === l.id) {
                if (j.post_notification === true) {
                  console.log("else is is working in true part")
                  const notificationData = `query MyQuery {
        mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
          notification_token
        }
      }`
                  var notificationStatus = await request(endpoint, notificationData, null, {
                    "x-hasura-admin-secret": adminSecret,
                  })
                  console.log("coming notification part", notificationStatus)
                  for (k of notificationStatus.mst_notification_token) {
                    //console.log(k.notification_token)
                    var devicetoken = k.notification_token
                    var noftication = `New  post is comment deleted by ${projectName}`
                    await sendNotificationEvenetCreation(devicetoken, noftication)
                  }
                  res.json({
                    message: "Success",
                    
                })
                }
                else if (j.post_notification == false) {
                  console.log("false is working")
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

exports.userDonateNotification = async (req, res) => {
  try {
    //console.log("body",req.body.event.data.new)
    if (req.body.event === 'INSERT') {
      var ngoid = req.body.ngoid
      var transactionStatus = `query MyQuery {
          mst__transactions(where: {ngo_id: {_eq: "${ngoid}"}}) {
            type
            payment_status
          }
        }`
      var data = await request(endpoint, transactionStatus, null, {
        "x-hasura-admin-secret": adminSecret,
      })
       console.log(data.mst__transactions[0].type)
      var ngoname = `query MyQuery {
  mst__ngos(where: {id: {_eq: "${ngoid}"}}) {
    name
  }
}`
      var ngoNamedata = await request(endpoint, ngoname, null, {
        "x-hasura-admin-secret": adminSecret,
      })
      console.log("ngoname", ngoNamedata.mst__ngos[0].name)
      var ngoName = ngoNamedata.mst__ngos[0].name
      for (i of data.mst__transactions) {
        console.log(i.type)
        //console.log(i.payment_status)
        if (i.type === 'PROJECT' && i.payment_status === 'Success') {
          console.log("welcome saran")
          const userdetails = `query MyQuery {
        map_user_follow(where: {followee_id: {_eq: "${ngoid}"}}) {
          follower_id
        }
      }`
          var userId = await request(endpoint, userdetails, null, {
            "x-hasura-admin-secret": adminSecret,
          })
          console.log(userId)
          for (j of userId.map_user_follow) {
            var userloopingID = j.follower_id
            console.log(userloopingID)
            const notificationstatus = `query MyQuery {
          mst_notification_preference(where: {user_id: {_eq: "${userloopingID}"}}) {
           project_notification
            preference
            ngo_id
          }
        }`
            var projectStatus = await request(endpoint, notificationstatus, null, {
              "x-hasura-admin-secret": adminSecret,
            })
            console.log("status", projectStatus.mst_notification_preference)
            for (k of projectStatus.mst_notification_preference) {
              console.log(k.project_notification)
              if (ngoid === k.ngo_id || k.ngo_id === null) {
                if (k.preference === 'NGO') {

                  if (k.project_notification === true) {
                    console.log("else is is working in true part")
                    const notificationData = `query MyQuery {
      mst_notification_token(where: {user_id: {_eq: "${userloopingID}"}}) {
        notification_token
      }
    }`
                    var notificationStatus = await request(endpoint, notificationData, null, {
                      "x-hasura-admin-secret": adminSecret,
                    })
                    console.log("coming notification part", notificationStatus)
                    for (l of notificationStatus.mst_notification_token) {
                      //console.log(k.notification_token)
                      var devicetoken = l.notification_token
                      var noftication = `Amount donated by ${ngoName}`
                      await sendNotificationEvenetCreation(devicetoken, noftication)
                    }
                  }
                  else if (k.project_notification === false) {
                    console.log("turn on notification")
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function sendNotificationEvenetCreation(devicetoken, noftication) {
  console.log("manoj");

  const payload = {
    notification: {
      title: "Pocket",
      body: noftication,
      click_action: 'FULTER_NOTIFICATION_CLICK'
    },
    data: {
      data1: 'data1 value',
      data2: 'data2 value'
    },

  }
  const Options = { priority: 'high', timeToLive: 60 * 60 * 24, };
  await firebase.messaging().sendToDevice(devicetoken, payload, Options)

    .then((response) => {
      console.log('Notification sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
    });
}

// const fcm = firebase.messaging();
// async function sendNotificationEvenetCreation(deviceToken, noftication) {
//   const message = {
//     token: deviceToken,
//     notification: {
//       title: 'Pocket',
//       body: noftication,
//     },
//   };

//   try {
//     const response = await fcm.send(message);
//     console.log('Successfully sent with response:', response);
//   } catch (error) {
//     console.error('Something has gone wrong!', error);
//   }
// }

// async function sendNotificationEvenetCreation(devicetoken, noftication) {
//   console.log("wer");

//   const payload = {
//     notification: {
//       title: "Pocket",
//       body: noftication,
//       click_action: 'FULTER_NOTIFICATION_CLICK'
//     },
//     data: {
//       data1: 'data1 value',
//       data2: 'data2 value'
//     },

//   }
//   const Options = { priority: 'high', timeToLive: 60 * 60 * 24, };
//   await firebase.messaging().sendToDevice(devicetoken, payload, Options)

//     .then((response) => {
//       console.log('Notification sent successfully:', response);
//     })
//     .catch((error) => {
//       console.error('Error sending notification:', error);
    
//     });
// }
