
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
const brevoController = require('./brevo.controller');

const accDetails = {
  "type": "service_account",
  "project_id": "pockets-b5ac9",
  "private_key_id": "cb75a2f0fc6256ca1598a2ade1334b2d80c7b12c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuXtKiTDI0m80V\n7/qJ0usj+zpcGSNHXHbc05aYD0qBCkmWAvJhipNE7GxROr5qeVnE7dKyJviVISCd\nUk5w0rSds/uJt8nskfXpjvtcYQZw1Qy/QFaqTgRoh7oDWqyJ5ECA8BNg4GOTkRW+\nFpd1X3t86Ug6AgHphuipHesfHQV/jTJFii71FG+LukZ8CKDWPVhJ9Z7dlyOCA+TB\nXeDTGRqZdrF/2HCo/W/p6nhogU/X5wc6YT109E6+8SG6clezY9PGUsfRUcwhCuBK\n09Wfa+qqLILTJYMVXyXJB0saQRyam+Wld6hpc90vVbku0uOxrJP2+a+Nqoc8H5Q9\nuUparu6nAgMBAAECggEACQe8HM+ZYgQXkOVGslCMAOcH1LEwlIeDWFhU2jcggqJH\nwU8Rwl9s1QrxaRuDtPvn3Dz8xmEiSobWq48RpOIknG4vvqgX+vpsI9ZVyij0Lm+6\nI0Vvt44myEsPJRFTEikR9ht4xXGZdpDy8U82NMvnF0b1iJuGAdQMxIVaIdhc6ogN\nZ0sEsUycpW64mZDBu01GKFvtOrMfP1o4ETnWfxkSVQuJd8j+29YVrtV6WyfK2b1+\nSj2UeHN9sFEq3i3/TOPlZ7ItuRp5UO6z+qauGQBhcmB8HHDhfqztprAEoJQw4ORL\ndMLvO2OFFn4ZrO5nffvF5nT2mgW516iPCt/DX6XiUQKBgQDsPBBigq3F8z1x8b+F\nVMcuCSHjAoOe+5x46bbX5OxkwH2o9DhbhrfPN1viZSKXQgdSKtgy5DEB1n4sJ5pf\nGySZMW2sCuzm/8A80soK8Wop4jVhqjHF+VEKrj8TRU/z9Bwq1F1H7IBEZWdGY3sx\nZMolsjSDHffh/ab0wdC7Bu6NGwKBgQC89a6ZSIQVTWjqPdnUcudYvnuD123iK3qf\noJkGv3E9wjQhL5Gz674LvB/E4ZFBv1U4eZiGkMQLTQEgKe8967roPvB3ZdUZXta2\nrRbcDU+PZQKOwuZRSDk5wc2Mt8PxgcC4xqokRdU9OB3N1SRfwPJuGbYovdDTmk+w\nRYpB1Rb5ZQKBgGqvcYLbm1jjUeOMlr7DG7S5oRkhQIni/bZJbi6wDuYtXFKaAH2t\nKIOnb5Kds/J1elLsUHkjPtKiqJaOSBQdcPjSLsJcqMJly85sL5yjjBtgMlVqBFJx\nFt1o9clhKwt0OehJwdrCfubkmLBcKv2SlAxUH4z7UsA3yleM1BQyvDbzAoGACmZf\nOLKECoQbLSFAVvAICZtaQvRdaOBJvHVjVrq8qdCBe/4ZP9TOveiZuwVLMFouf5A5\ns9ZN4+1WDYYhU8Agpl2ocHnbU60jliRKqMvWwCaoEGFrubeG5sXi4UbP8v/YMpNE\nlAB/7wGiqkx71wVQkny5yN5BmxPYJPR+2oa23/0CgYAxzr5KrBAuq5LIlqBZeLXl\nMtuQwTyMX0x4QpdWgKwYQmh7Sgw/RPc4kUip7PFZaCqe8mgfjqFqhQ2LxQgdbnEV\n4nAADRce9Q5/jpKInj9x+EjjduwuViBvPfTCkrffr/O6iP08dG9MyZRxxC/Kergq\nHxRUaj4J9NcdYx3HzeAoDA==\n-----END PRIVATE KEY-----\n",
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