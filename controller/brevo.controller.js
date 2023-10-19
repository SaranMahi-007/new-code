const https = require('https');
const SibApiV3Sdk = require("sib-api-v3-sdk");
// const {readFileSync} = require('fs');
const fs = require("fs");
const handlebars = require("handlebars");
const { default: axios } = require('axios');
var nodemailer = require("nodemailer");




exports.sendBrevoReportEmail = async (req, res) => {
    console.log(req.body, "reqstatug")
    const { name, email } = req.body;

    const emailTemplateSource = fs.readFileSync('./views/report.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)

    const emailHtml = emailTemplate();
    try {
        var SibApiV3Sdk = require('sib-api-v3-sdk');
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

            "sender": { "email": "Hello@pocketgiving.co.uk", "name": "Pocket" },
            "subject": "This is my default subject line",
            // "templateId": 2,
            "htmlContent": emailHtml,

            "messageVersions": [
                //Definition for Message Version 1 
                {
                    "to": [
                        {
                            "email": email,
                            "name": name
                        }

                    ],

                    "subject": "Report submitted to Pocket."
                },


            ]

        }).then(function (data) {
            console.log(data);
            res.json({
                message: "Report submit successfully",
                data
            })
        }, function (error) {
            console.error(error);
        });
    }
    catch (err) {
        res.json({
            message: "Error",
            err
        })
    }
};

exports.sendBrevoPaymentEmail = async (req, res) => {
    console.log(req.body, "reqstatug")
    const { name, email } = req.body;

    const emailTemplateSource = fs.readFileSync('./views/payment.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)

    const emailHtml = emailTemplate();
    try {
        var SibApiV3Sdk = require('sib-api-v3-sdk');
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

            "sender": { "email": "Hello@pocketgiving.co.uk", "name": "Pocket" },
            "subject": "This is my default subject line",
            // "templateId": 2,
            "htmlContent": emailHtml,
            "params": {
                "greeting": "This is the default greeting",
                "headline": "This is the default headline"
            },
            "messageVersions": [
                //Definition for Message Version 1 
                {
                    "to": [
                        {
                            "email": email,
                            "name": name
                        }

                    ],

                    "subject": "You have made a successful transaction !"
                },

            ]

        }).then(function (data) {
            console.log(data);
            res.json({
                message: "Payment Success",
                data
            })
        }, function (error) {
            console.error(error);
        });
    }
    catch (err) {
        res.json({
            message: "Error",
            err
        })
    }
};

exports.emailtrigger = (bodyPassword, bodyEmail, bodyName) => {
    // console.log(req.body, "reqstatug")
  
    // const { name, email } = req.body;

    const emailTemplateSource = fs.readFileSync('./views/welcome.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)
    const emaildata ={
        Username:bodyName,
        Email:bodyEmail,
        Password:bodyPassword
       }
    const emailHtml = emailTemplate(emaildata);
    try {
        var SibApiV3Sdk = require('sib-api-v3-sdk');
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

            "sender": { "email": "Hello@pocketgiving.co.uk", "name": "Pocket" },
            "subject": "This is my default subject line",
            // "templateId": 2,
            "htmlContent": emailHtml,
            
            "messageVersions": [
                //Definition for Message Version 1 
                {
                    "to": [
                        {
                            "email": bodyEmail,
                            "name": bodyName
                        }

                    ],

                    "subject": "Some deals worth to be looked at!"
                },

            ]

        }).then(function (data) {
            console.log(data);
          
            // res.json({
            //     message: "Register Success",
            //     data
            // })

        }, function (error) {
            console.error(error);
        });
        return data
    }
    catch (err) {
        // res.json({
        //     message: "Error",
        //     err
        // })
    }
}

// exports.sendBrevoWelcome = async (req,res,bodyPassword, bodyEmail, bodyName) => {
//     console.log(req.body, "reqstatug")
  
//     const { name, email } = req.body;

//     const emailTemplateSource = fs.readFileSync('./views/welcome.handlebars', "utf8");
//     const emailTemplate = handlebars.compile(emailTemplateSource)
//     const emaildata ={
//         Username:bodyName,
//         Email:bodyEmail,
//         Password:bodyPassword
//        }
//     const emailHtml = emailTemplate(emaildata);
//     try {
//         var SibApiV3Sdk = require('sib-api-v3-sdk');
//         SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

//         new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

//             "sender": { "email": "Hello@pocketgiving.co.uk", "name": "Pocket" },
//             "subject": "This is my default subject line",
//             // "templateId": 2,
//             "htmlContent": emailHtml,
            
//             "messageVersions": [
//                 //Definition for Message Version 1 
//                 {
//                     "to": [
//                         {
//                             "email": email,
//                             "name": name
//                         }

//                     ],

//                     "subject": "Some deals worth to be looked at!"
//                 },

//             ]

//         }).then(function (data) {
//             console.log(data);
//             res.json({
//                 message: "Register Success",
//                 data
//             })
//         }, function (error) {
//             console.error(error);
//         });
//     }
//     catch (err) {
//         res.json({
//             message: "Error",
//             err
//         })
//     }
// };


exports.sendBrevoRefund = async (req, res) => {
    console.log(req.body, "reqstatug")
    const { name, email } = req.body;

    const emailTemplateSource = fs.readFileSync('./views/refund.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)

    const emailHtml = emailTemplate();
    try {
        var SibApiV3Sdk = require('sib-api-v3-sdk');
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

            "sender": { "email": "Hello@pocketgiving.co.uk", "name": "Pocket" },
            "subject": "This is my default subject line",
            // "templateId": 2,
            "htmlContent": emailHtml,
            "params": {
                "greeting": "This is the default greeting",
                "headline": "This is the default headline"
            },
            "messageVersions": [
                //Definition for Message Version 1 
                {
                    "to": [
                        {
                            "email": email,
                            "name": name
                        }

                    ],

                    "subject": "Pocket has refunded."
                },

            ]

        }).then(function (data) {
            console.log(data);
            res.json({
                message: "Payment refund Success",
                data
            })
        }, function (error) {
            console.error(error);
        });
    }
    catch (err) {
        res.json({
            message: "Error",
            err
        })
    }
};

exports.sendBrevoExport = async (req, res) => {
    console.log(req.body, "reqstatug")
    const { name, email } = req.body;

    const emailTemplateSource = fs.readFileSync('./views/export.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)

    const emailHtml = emailTemplate();
    try {
        var SibApiV3Sdk = require('sib-api-v3-sdk');
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

            "sender": { "email": "Hello@pocketgiving.co.uk", "name": "Pocket" },
            "subject": "This is my default subject line",
            // "templateId": 2,
            "htmlContent": emailHtml,
           
            "messageVersions": [
                //Definition for Message Version 1 
                {
                    "to": [
                        {
                            "email": email,
                            "name": name
                        }

                    ],

                    "subject": "Some deals worth to be looked at!"
                },

            ]

        }).then(function (data) {
            console.log(data);
            res.json({
                message: "File export Success",
                data
            })
        }, function (error) {
            console.error(error);
        });
    }
    catch (err) {
        res.json({
            message: "Error",
            err
        })
    }
};

exports.sendBrevoProject = async (req, res) => {
    console.log(req.body, "reqstatug")
    const { name, email,charityname } = req.body;
const user ={
    userName:name||"User",
    charityName:charityname

}
    const emailTemplateSource = fs.readFileSync('./views/projectcreate.handlebars', "utf8");
    const emailTemplate = handlebars.compile(emailTemplateSource)

    const emailHtml = emailTemplate(user);
    try {
        var SibApiV3Sdk = require('sib-api-v3-sdk');
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = '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';

        new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

            "sender": { "email": "Hello@pocketgiving.co.uk", "name": "Pocket" },
            "subject": "This is my default subject line",
            // "templateId": 2,
            "htmlContent": emailHtml,
           
            "messageVersions": [
                //Definition for Message Version 1 
                {
                    "to": [
                        {
                            "email": email,
                            "name": name||"user"
                        }

                    ],

                    "subject": "We have a new project created !Here are its details."
                },

            ]

        }).then(function (data) {
            console.log(data);
            res.json({
                message: "File export Success",
                data
            })
        }, function (error) {
            console.error(error);
        });
    }
    catch (err) {
        res.json({
            message: "Error",
            err
        })
    }
};

exports.sendSMSBrevo = async(req,res)=>{
    const{recipient,content}=req.body
    console.log(req.body)
    try{
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
  
      let apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = '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';
      
      let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();
      
      let sendTransacSms = new SibApiV3Sdk.SendTransacSms();
      
      sendTransacSms = {
          "sender":"Pocket",
          "recipient":recipient,
          "content":content,
      };
      
      apiInstance.sendTransacSms(sendTransacSms).then(function(data) {
        console.log(data);
        res.json({
            message: "SMS send successfully",
            data
        })
      }, function(error) {
        res.json({
            message: "Error",
            error
        })
        console.error(error);
      });
    }
    catch (err) {
        res.json({
            message: "Error",
            err
        })
    }
}


exports.sendSmsFunc = async (recipient, content) => {
    try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;

        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = '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';

        let apiInstance = new SibApiV3Sdk.TransactionalSMSApi();

        let sendTransacSms = new SibApiV3Sdk.SendTransacSms();

        sendTransacSms = {
            "sender": "Pocket",
            "recipient": recipient,
            "content": content,
        };

        apiInstance.sendTransacSms(sendTransacSms).then(function (data) {
            console.log("SMS send successfully", data);
            //   res.json({
            //       message: "SMS send successfully",
            //       data
            //   })

        })
    }
    catch (err) {
        console.log('10393898848448484844848488', err)
        return res.json({ success: false, message: err.message })
    }
}

exports.sendEmailbrevo = async (emailId, text, subject) => {
    console.log("start sending email", emailId, text);
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "Hello@pocketgiving.co.uk",
            pass: "xsmtpsib-bc8582713523a3216c4e00961ef6fb9c353aeb2fe95c6bef3838d7765631a34b-KpO3xGRgc2CQdWjw",
        },
    });

    const mailOptions = {

        from: '"Pockets" <Hello@pocketgiving.co.uk>',
        to: emailId,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendEmail = async (emailId,subject,text) => {
    console.log("start sending email", emailId, text);
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "Hello@pocketgiving.co.uk",
            pass: "xsmtpsib-bc8582713523a3216c4e00961ef6fb9c353aeb2fe95c6bef3838d7765631a34b-KpO3xGRgc2CQdWjw",
        },
    });

    const mailOptions = {

        from: '"Pockets" <Hello@pocketgiving.co.uk>',
        to: emailId,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            
        }
    });
}

