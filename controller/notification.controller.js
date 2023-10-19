var nodemailer = require("nodemailer");
const emailValidator = require('email-validator');
const express = require("express");
const ngrok = require('ngrok');
const PhoneNumber = require('libphonenumber-js');
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { stitchSchemas } = require("@graphql-tools/stitch");
const otpGenerator = require("otp-generator");
var bodyParser = require("body-parser");
// const { createApolloFetch } = require('apollo-fetch');
var nodemailer = require("nodemailer");
const { request } = require("graphql-request");
const app = express();
const cors = require("cors");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
var { createClient } = require("hasura-client");
const { consumers } = require("nodemailer/lib/xoauth2");
const https = require('https');
const cloudinary = require("cloudinary").v2;
const url = require('url')
const fs = require("fs");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { gql } = require("graphql-request");
const { client } = require('../client');
const { generateJWT } = require('../jwt')
const firebase = require('firebase-admin');
const path = require('path');
const accDetails = {
    "type": "service_account",
    "project_id": "pocketsf-a05c9",
    "private_key_id": "e8fd1b6eff5fe1ce013f6bf6a6e8e80c4cd074cd",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCfs6iD2Uov2WTC\nFFCMuNNvS6O1S6NG9SKVdG/vFqQ6JyFkpxvn8IBsCBRQebScmnImgoVsvxA7Q6yb\n+WcrmhY21GesWLThI8gxMUeFZn0/8aeB2T1njbHQmaegp3jMfh4xQI2Gg6QP1tTZ\nRa1vhSYfaQKTh2qjr7/MoebH0BoJmYWMtW4wJYxUilxWByRdYMk6/Z3wSWdG3HqV\nFy+VVU1VGfI0VoY0nQ42yfxlA214A3sKMmg3Ifml3/ufTOFv7b+as+ro3mgwyl1b\nS7FStp15FR7zWvt+059ZhLl7rzSa19mihi5Y3iwfifPKuk35awAaOY7lkonGjjZr\nBllK9pmtAgMBAAECggEAHIOKDrJ877KnrgxM/ncgjyJI8j11Q13QxTEDLEPVYimq\n6Wr5zU1wTHmb0OuN/xkHUQ9kTbCGcCJq3vVmgY8zMKp3cTrsXrdSDtBu5edQ7RoT\nL5ivQT44FZfdqU5Ff/NzphURv8bgw9A2dC2f5AW4swp/goI+3MdsHhf5Gcty3qwh\nfKSIQrGrG60EULHJ67W3RiQRp1YR8k8XPwelye6UZ9OADgpz3ewlNDgdzmpfheP1\nRynAkDjX8QQbR9KJXZa9Vi7TSESrXsAmJ3CGR+HZ2h9JXUcpxV+Ws7YIG9MIyKU7\ngi/91gvQr3S6lFiVqW7BHbkiLvMnjSLBa0r6FB5Q0QKBgQDSbWOLXjdP6VWY5PCv\nQElpIuQeDo0XjgQ2QSuSzIbFXEIHeDf09FtlVRmhGIcUcI+Q7rn3wqYiG3ruVSCB\najPgiE6WZlHCSPFhCGyksBYWiRUUh5aZODIig/d/wQv2yRoVkT+TiWj4W3f1Cy7h\nGpxkF57rDnpO2TUsPpdQB5hWcQKBgQDCSevgYC1vWUTVQbsCp0Z31yLlKaCV9sqi\nvV0dMKzrTNzMX2wRF6aQUi8eAyb2+Lqz2kjHT654NG318SZ4KXjwaAoIsfXJBu4r\nzXHCKLsaj1cQ9KKkNyTt1T7n/CuLZ9zAsc4/cm9I3H5Vjvoy66xUu2yKJIZClsqt\nqU9oq8ns/QKBgGMa5fEztHVMfeX+nWTMsEZ2Cl4lmEnptw4eb3k6HpdBNk/yTNhv\nZcQ56lI3DReRU+x8otWPtVMHAkTRjveknz42tFydYBBS7mw23YRK8nw2n9kFauZK\n00HySVTABPR8Dm7t87V22BtwaPTeCXw3XkS94zjtnqkYH7Tw3a7xhMvhAoGAf8yq\nKKR7HoRk37Zl8h/gHZJZNM6GAD8fGZ9gMYREKl8b2h9mcXPSL5qvvZkrN0dzYDzU\npK5IQG+UaTPgLyhwkgqNlxygZUR2xD9WdfXe5WCmT9PrbAON+hfMUkKwzfla3zHW\nTivTAeVwAI2VDIuzhuTmR5Qw8HpKBaOaRWrC320CgYBRtvgOt2gdgqxdfARHWxXR\nmQs84FpBJ0HgZtqV7wbokmw17Y2R9Cp43ABQRj6WNQBJzZXfDlsEk8LB7GT5SRxe\nd/ymQOTL5pPvk5kxSjo8qw6Ls58n5+qyTrj1EFGZ0frAQeVrjtAhFU+a6fJHt0cy\nXHPUSbv0pb3kPX0sdG5/kw==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-a10cq@pocketsf-a05c9.iam.gserviceaccount.com",
    "client_id": "106350607719247940120",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-a10cq%40pocketsf-a05c9.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }

  // firebase.initializeApp({
  //   credential: firebase.credential.cert(accDetails)
  // }); 

  const endpoint = "https://web.pocketgiving.co.uk/v1/graphql";
  const adminSecret = "AcdBFQjcVnQW987Py9785MvJ7567";

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));


async function emailtrigger(receiveremail, generateOtp) {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
  
    const tranEmailApi = new Sib.TransactionalEmailsApi();
  
    const sender = {
      email: "manojkumargsm63@gmail.com",
    };
  
    const receivers = [
      {
        email: receiveremail,
      },
    ];
    tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "OTP verification ",
      textContent: `Your OTP is ${generateOtp}`,
    });
  }

exports.mailtrigeer = (req, res) => {
    email = req.body.email;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.emailid,
        pass: process.env.password,
      },
    });
    var mailOptions = {
      from: process.env.emailid,
      to: email,
      subject: "pocket app",
      text: req.body.message,
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
      return res.json({
        Success: true,
        message: "Email send successfully",
      });
    });
  };

  exports.users= async (req, res) => {
    try {
      const query = `
          query {
            users {
              id
              email
              metadata
            }
          }
        `;
      request(endpoint, query, null, { "x-hasura-admin-secret": adminSecret })
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request");
    }
  };

exports.userupdate = async (req, res) => {
    try {
      console.log("request", req.body.event.data.new.id);
      console.log("%j", req.body.event.data);
      _id = req.body.event.data.new.id;
      receiveremail = req.body.event.data.new.email;
      generateOtp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      console.log("generateOtp", generateOtp);
      const data = `mutation MyMutation {
        insert_user_otp(objects: {user_id: "${_id}", user_otp: "${generateOtp}"}) {
          affected_rows
          returning {
            user_otp
            user_id
          }
        }
      }`;
  
      request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret });
      await emailtrigger(receiveremail, generateOtp)
        .then((data) => res.json(data))
        .catch((error) => res.json(error));
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request");
    }
  };  
 
exports.sendmail = (req, res) => {
    console.log("request", req.body);
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
  
    const tranEmailApi = new Sib.TransactionalEmailsApi();
  
    const sender = {
      email: "manojkumargsm63@gmail.com",
    };
  
    const receivers = [
      {
        email: req.body.email,
      },
    ];
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: "welcome ",
        textContent: req.body.message,
      })
      .then(() => {
        res.json({
          message: "email send successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        res.json({
          message: "An Error Occured",
        });
      });
  };  

exports.postnotification = async (req, res) => {
  console.log("saran")
    var consumer_name;
    var noftication;
    console.log(req.body.event.data);
  
    try {
      
      if (req.body.event.op == "UPDATE") {
        res.setHeader("Content-Type", "application/json");
        console.log("update checking");
        var ngoID = req.body.event.data.new.ngo_id;
        const ngoName = `query MyQuery {
          mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
            name
          }
        }`;
        await request(endpoint, ngoName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          consumer_name = name;
        });
        var oldData = req.body.event.data.old
        var newData = req.body.event.data.new
        const updatedFields = {};
  
        for (var key in newData) {
          if (newData.hasOwnProperty(key)
            && oldData.hasOwnProperty(key)) {
            if (oldData[key] !== newData[key]) {
              updatedFields[key] = newData[key];
            }
          }
        }
  
        var pairs = Object.entries(updatedFields);
        var newConsumerName = consumer_name.mst__ngos[0].name;
        console.log("saran")
        console.log("welcome", consumer_name.mst__ngos[0].name);
        console.log("saran is coming")
        const title = req.body.event.data.new.title
        console.log("title", title)
        var consumerid = req.body.event.data.new.id;
        var projectId = req.body.event.data.new.project_id
        console.log("data", projectId)
        var noftication = `Post ${title} has been updated by charity ${newConsumerName} `;
        var values = [];
        console.log("saran is reachingg")
        for (var i = 0; i < pairs.length; i++) {
  
          var notificationData = `Updated fields:${pairs[i][0]} `
          const data = await `mutation MyMutation {
        insert_notification(objects: {notification_message: "${noftication}", ngo_id:"${ngoID}", post_id: "${consumerid}", project_id: "${projectId}", updated_fields: "${notificationData}"}) {
          affected_rows
        }
      }
  `;
          request(endpoint, data, null, {
            "x-hasura-admin-secret": adminSecret,
          })
            .then((data) =>
  
              res.status(200).send({ message: 'Success' }))
            .catch((error) => res.send(error));
  
          //values.push(pairs[i][1]);
        }
  
      }
  
      else if (req.body.event.op == "DELETE") {
        var ngoID = req.body.event.data.old.ngo_id;
        const ngoName = `query MyQuery {
              mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
                name
              }
            }`;
        await request(endpoint, ngoName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          consumer_name = name;
        });
        var newConsumerName = consumer_name.mst__ngos[0].name;
        var projectId = req.body.event.data.old.project_id
        const title = req.body.event.data.old.title
        console.log("hjkfjlkkl", newConsumerName);
        var consumerid = req.body.event.data.old.id;
        console.log("delete api", req.body.data);
        var noftication = `Post ${title} has been deleted by charity ${newConsumerName}`;
  
        const data = `mutation MyMutation {
          insert_notification(objects: {notification_message: "${noftication}", ngo_id: "${ngoID}", post_id: "${consumerid}", project_id: "${projectId}"}) {
            affected_rows
          }
        }
      `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) => res.json("notification added successfully"))
          .catch((error) => res.json(error));
      } else if (req.body.event.op == "INSERT") {
        var ngoID = req.body.event.data.new.ngo_id;
        const ngoName = `query MyQuery {
              mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
                name
              }
            }`;
        await request(endpoint, ngoName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          consumer_name = name;
        });
        var newConsumerName = consumer_name.mst__ngos[0].name;
        var consumerid = req.body.event.data.new.id;
        var projectId = req.body.event.data.new.project_id
        const title = req.body.event.data.new.title
        console.log("id vanthu", consumerid);
        noftication = `New Post ${title} has been created by charity ${newConsumerName}`;
  
        const notificationactiveStatus = `query MyQuery {
          mst_notification_preference(where: {is_active: {_eq: true}}) {
            user_id
          }
        }`
        await request(endpoint, notificationactiveStatus, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (activedata) => {
          console.log("data", activedata.mst_notification_preference)
          var newData = activedata.mst_notification_preference
          for (const i of newData) {
            const userToken = ` query MyQuery {
              mst_notification_token(where: {user_id: {_eq: "${i.user_id}"}}) {
                notification_token
              }
            }`
            await request(endpoint, userToken, null, {
              "x-hasura-admin-secret": adminSecret,
            }).then(async (tokendata) => {
              //console.log("tokenvalue", tokendata.mst_notification_token[0].notification_token)
              //var newTokenValue = tokendata.mst_notification_token[0].notification_token
              //sendNotificationEvenetCreation(newTokenValue, noftication)
            })
          }
        })
        //sendNotificationEvenetCreation(noftication);
        const data = `mutation MyMutation {
          insert_notification(objects: {notification_message: "${noftication}", ngo_id: "${ngoID}", post_id: "${consumerid}", project_id: "${projectId}"}) {
            affected_rows
          }
        }
      `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) => res.json("notification added successfully"))
          .catch((error) => res.json(error));
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request");
    }
  };  

exports.projectnotification= async (req, res) => {
    var consumer_name;
    var noftication;
    console.log(req.body.event.data.new);
    try {
   
  
      // if (req.body.event.op == "UPDATE") {
      //   var ngoID = req.body.event.data.new.ngo_id;
      //   console.log("ngoid", ngoID)
      //   const ngoName = `query MyQuery {
      //         mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
      //           name
      //         }
      //       }`;
      //   await request(endpoint, ngoName, null, {
      //     "x-hasura-admin-secret": adminSecret,
      //   }).then(async (name) => {
      //     consumer_name = name;
      //   });
      //   var oldData = req.body.event.data.old
      //   var newData = req.body.event.data.new
      //   const updatedFields = {};
  
      //   for (var key in newData) {
      //     if (newData.hasOwnProperty(key)
  
      //       && oldData.hasOwnProperty(key)) {
      //       if (oldData[key] !== newData[key]) {
      //         updatedFields[key] = newData[key];
      //       }
      //     }
      //   }
      //   var pairs = Object.entries(updatedFields);
  
      //   var newConsumerName = consumer_name.mst__ngos[0].name;
      //   console.log("welcome", consumer_name.mst__ngos[0].name);
      //   var consumerid = req.body.event.data.new.id;
      //   var titlename = req.body.event.data.new.name
      //   console.log("title", titlename)
      //   noftication = `Project ${titlename} has been updated by charity ${newConsumerName} `;
      //   for (var i = 0; i < pairs.length; i++) {
  
      //        var notificationData = `Updated fields:${pairs[i][0]} `
      //     var data = `mutation MyMutation {
      //       insert_notification(objects: {notification_message: "${noftication}", ngo_id:"${ngoID}", project_id: "${consumerid}", updated_fields: "${notificationData}"}) {
      //         affected_rows
      //       }
      //     }`
      //     request(endpoint, data, null, {
      //       "x-hasura-admin-secret": adminSecret,
      //     })
      //       // .then(message =>
      //       //   res.status(200).send({
      //       //     'Success': true, 'message': ''
      //       //   })
      //       // )
      //        .catch((error) =>{
      //         console.log("the error is",error)
      //         res.json({
      //           error
      //         })
      //       })
      //       res.status(200).send({
      //         'Success': true,
      //         'message': ''
      //       });
  
      //   }

      // } 
      if (req.body.event.op == "UPDATE") {
        const ngoID = req.body.event.data.new.ngo_id;
        
        const ngoNameQuery = `query MyQuery {
          mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
            name
          }
        }`;
      
        try {
          const nameResponse = await request(endpoint, ngoNameQuery, null, {
            "x-hasura-admin-secret": adminSecret,
          });
          
          const consumer_name = nameResponse.mst__ngos[0].name;
          const newData = req.body.event.data.new;
          const updatedFields = {};
        
          for (const key in newData) {
            if (newData.hasOwnProperty(key)) {
              const oldValue = req.body.event.data.old[key];
              if (oldValue !== newData[key]) {
                updatedFields[key] = newData[key];
              }
            }
          }
          
          const pairs = Object.entries(updatedFields);
          const consumerId = newData.id;
          const titleName = newData.name;
          const notificationMessage = `Project ${titleName} has been updated by charity ${consumer_name}`;
        
          const notificationPromises = pairs.map(async ([field, value]) => {
            const notificationData = `Updated fields: ${field}`;
            const notificationMutation = `mutation MyMutation {
              insert_notification(objects: {
                notification_message: "${notificationMessage}",
                ngo_id: "${ngoID}",
                project_id: "${consumerId}",
                updated_fields: "${notificationData}"
              }) {
                affected_rows
              }
            }`;
            
            await request(endpoint, notificationMutation, null, {
              "x-hasura-admin-secret": adminSecret,
            });
          });
        
          await Promise.all(notificationPromises);
      
          // Send the response after all operations are done
          res.status(200).json({
            'Success': true,
            'message': 'success'
          });
        } catch (error) {
          console.log("the error is", error);
          res.status(500).json({
            error: 'Internal Server Error'
          });
        }
      }
      
      else if (req.body.event.op == "DELETE") {
        console.log("delete",req.body.event.data)
        var ngoID = req.body.event.data.old.ngo_id;
        const ngoName = `query MyQuery {
              mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
                name
              }
            }`;
        await request(endpoint, ngoName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          consumer_name = name;
        });
        var newConsumerName = consumer_name.mst__ngos[0].name;
        console.log("hjkfjlkkl", newConsumerName);
        var titlename = req.body.event.data.old.name
        var consumerid = req.body.event.data.old.id;
        console.log("delete api", req.body.data);
        var noftication = `Project ${titlename} has been deleted by ${newConsumerName}`;
  
        const data = `mutation MyMutation {
          insert_notification(objects: {notification_message: "${noftication}", ngo_id:"${ngoID}", post_id: "${consumerid}", project_id: "${consumerid}", updated_fields: "null"}) {
            affected_rows
          }
        }
    `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) => res.json("notification added successfully"))
          .catch((error) => res.json(error));
      } else if (req.body.event.op == "INSERT") {
        console.log("create",req.body.event.data)
        var projectId =req.body.event.data.new.id 
        var ngoID = req.body.event.data.new.ngo_id;
        const ngoName = `query MyQuery {
              mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
                name
              }
            }`;
        await request(endpoint, ngoName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          consumer_name = name;
        });
        var newConsumerName = consumer_name.mst__ngos[0].name;
        var consumerid = req.body.event.data.new.id;
        console.log("id vanthu", consumerid);
        var noftication = `New Project UK Charity Has been Created BY\\\\${newConsumerName}\\\\`;
        var modifiedTitle = noftication.replace(/\\/g, '');
        console.log("storing title",modifiedTitle)

        var devicenotification = `query MyQuery {
          mst__projects(where: {id: {_eq: "${consumerid}"}}) {
            name
          }
        }`
        var newvalue = await request(endpoint, devicenotification, null, {
          "x-hasura-admin-secret": adminSecret,
        })
        console.log("newvalue", newvalue)
        var projectName = newvalue.mst__projects[0].name
        var newSendNotification = `A new project called "${projectName}" is created`
        const notificationactiveStatus = `query MyQuery {
          mst_notification_preference(where: {is_active: {_eq: true}}) {
            user_id
          }
        }`
        await request(endpoint, notificationactiveStatus, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (activedata) => {
          console.log("data", activedata.mst_notification_preference)
          var newData = activedata.mst_notification_preference
          for (const i of newData) {
            const userToken = ` query MyQuery {
              mst_notification_token(where: {user_id: {_eq: "${i.user_id}"}}) {
                notification_token
              }
            }`
            await request(endpoint, userToken, null, {
              "x-hasura-admin-secret": adminSecret,
            }).then(async (tokendata) => {
              // console.log("tokenvalue", tokendata.mst_notification_token[0].notification_token)
              // var newTokenValue = tokendata.mst_notification_token[0].notification_token
              //sendNotificationEvenetCreation(newTokenValue, newSendNotification)
            })
          }
        })
        const data = `mutation MyMutation {
        insert_notification(objects: {notification_message: "${modifiedTitle}",ngo_id:"${ngoID}",project_id: "${projectId}"}) {
          affected_rows
        }
      }
      `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) => res.json("notification added successfully"))
          .catch((error) =>{
            console.log("the error is",error)
            res.json({
              error
            })
          })
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request");
    }
  };  

exports.postlikenotification= async (req, res) => {
    var consumer_name;
    var consumerngo_id 
    try {
      console.log("body", req.body.event.data.new);
      var userId =req.body.event.data.new.userID 
      if (req.body.event.op == "INSERT") {
        var userID = req.body.event.data.new.id;
        const userName = `query MyQuery {
          mst_post_like(where: {id: {_eq: "${userID}"}}) {
            mst_post {
              ngo_id
            }
            user {
              displayName
            }
          }
        }`;
        await request(endpoint, userName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          console.log("display", name.mst_post_like[0].user.displayName);
          //console.log("%j", name.mst_post_like[0].user.displayName);
          console.log("%j", name.mst_post_like[0].mst_post.ngo_id);
          consumer_name = name.mst_post_like[0].user.displayName;
          consumerngo_id=name.mst_post_like[0].mst_post.ngo_id
        });
        //console.log("name===", userName);
        var newConsumerName =consumer_name 
        var ngo_id =consumerngo_id 
       
        var consumerid = req.body.event.data.new.id;
        console.log("id vanthu", consumerid);
        var noftication = `New post UK Charity has been liked by ${newConsumerName}`;
  
        const data = `mutation MyMutation {
        insert_notification(objects: {post_like_id: "${consumerid}",notification_message: "${noftication}",user_id:"${userId}",ngo_id:"${ngo_id}"}) {
          affected_rows
        }
      }
      `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) =>
            res.json("notification added successfully"))
            .catch((error) =>{
              console.log("the error is",error)
              res.json({
                error
              })
            })
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request");
    }
  };  

exports.postcommandnotification= async (req, res) => {
    try {
      
      //var userid =req.body.event.data.new.user_id
      if (req.body.event.op == "UPDATE") {
        var consumer_name;
        var ngoId
        var user_id = req.body.event.data.new.user_id;
        var userID =  req.body.event.data.new.id
        const userName = `query MyQuery {
          mnt__comments(where: {id: {_eq: "${userID}"}}) {
            mst_post {
              ngo_id
            }
            users {
              displayName
            }
          }
        }`;
        await request(endpoint, userName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          console.log("name =", name);
          consumer_name = name.mnt__comments[0].users.displayName;
          ngoId =name.mnt__comments[0].mst_post.ngo_id 
        });
         
        var newConsumerName = consumer_name;
        var ngo_id =ngoId

        //var newConsumerName = consumer_name.users[0].displayName;
      
        var consumerid = req.body.event.data.new.id;
        console.log("id vanthu", consumerid);
        var noftication = `New post comment updated by ${newConsumerName}`;
  
        const data = `mutation MyMutation {
        insert_notification(objects: {post_like_id: "${consumerid}",notification_message: "${noftication}",user_id:"${user_id}",ngo_id:"${ngo_id}"}) {
          affected_rows
        }
      }
      `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) => res.json("notification added successfully"))
          .catch((error) =>{
            console.log("the error is",error)
            res.json({
              error
            })
          })
      } else if (req.body.event.op == "INSERT") {
        var consumer_name;
        var ngoId
        var user_id =req.body.event.data.new.user_id
        console.log("userid",user_id)
        var userID =  req.body.event.data.new.id;
        const userName = `query MyQuery {
          mnt__comments(where: {id: {_eq: "${userID}"}}) {
            mst_post {
              ngo_id
            }
            users {
              displayName
            }
          }
        }`;
        await request(endpoint, userName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          console.log("name", name.mnt__comments[0].users.displayName);
          console.log("ngoid=",name.mnt__comments[0].mst_post.ngo_id)
          consumer_name = name.mnt__comments[0].users.displayName;
          ngoId =name.mnt__comments[0].mst_post.ngo_id 
        });
  
        var newConsumerName = consumer_name;
        var ngo_id =ngoId
       
        var consumerid = req.body.event.data.new.id;
        console.log("id vanthu", consumerid);
        var noftication = `New post commented by ${newConsumerName}`;
  
        const data = `mutation MyMutation {
        insert_notification(objects: {post_like_id: "${consumerid}",notification_message: "${noftication}",user_id:"${user_id}",ngo_id:"${ngo_id}"}) {
          affected_rows
        }
      }
      `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) => res.json("notification added successfully"))
          .catch((error) =>{
            console.log("the error is",error)
            res.json({
              error
            })
          })
      } else if (req.body.event.op == "DELETE") {
        console.log("body", req.body);
      console.log("body", req.body.event.data.old)
        var consumer_name;
        //var ngoId
        var user_id = req.body.event.data.old.user_id;
       // var userID= req.body.event.data.old.id
        var postId = req.body.event.data.old.post_id
        console.log("id is",userID)
        const userName = `query MyQuery {
          users(where: {id: {_eq: "${user_id}"}}) {
            displayName
          }
        }`;
        await request(endpoint, userName, null, {
          "x-hasura-admin-secret": adminSecret,
        }).then(async (name) => {
          console.log("name",name)
          consumer_name = name;
        });
        const ngoID =`query MyQuery {
          mst_posts(where: {id: {_eq: "${postId}"}}) {
            ngo_id
          }
        }`
    var ngodataId=await request(endpoint, ngoID, null, {
          "x-hasura-admin-secret": adminSecret,
        })
         var newConsumerName = consumer_name.users[0].displayName;
         console.log("name is data",newConsumerName);
        // var ngo_id =ngoId
        console.log("csname", ngodataId.mst_posts[0].ngo_id);
        var ngo_ID =ngodataId.mst_posts[0].ngo_id;
        var consumerid = req.body.event.data.old.id;
        //console.log("delete api", req.body.data);
        var noftication = `Post comment deleted by ${newConsumerName}`;
  
        const data = `mutation MyMutation {
        insert_notification(objects: {post_like_id: "${consumerid}",notification_message: "${noftication}",user_id:"${user_id}",ngo_id:"${ngo_ID}"}) {
          affected_rows
        }
      }
      `;
        request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
          .then((data) => res.json("notification added successfully"))
          .catch((error) =>{
            console.log("the error is",error)
            res.json({
              error
            })
          })
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request");
    }
  };  

  exports.repostnotification = async (req, res) => {
       console.log(req.body.event.data.new)
       //var consumer_name
       try{
      if(req.body.event.op == "INSERT"){
        var title;
        var ngo_ID;
        var user_name;
           console.log("welcome")
           var id = req.body.event.data.new.id
           var postID =req.body.event.data.new.post_id
           var userID=req.body.event.data.new. user_id
           const userName = `query MyQuery {
            mst_repost(where: {id: {_eq: "${id}"}}) {
              posts {
                ngo_id
                title
              }
              user {
                displayName
              }
            }
          }`;
          await request(endpoint, userName, null, {
            "x-hasura-admin-secret": adminSecret,
          }).then(async (name) => {
         
            user_name = name.mst_repost[0].user.displayName;
            ngo_ID =name.mst_repost[0].posts.ngo_id;
            title = name.mst_repost[0].posts.title
          });

          var newUsername = user_name
          var newngoID =  ngo_ID
          var newTitle = title

          console.log("jjj", newUsername);
          console.log("fine", newngoID);
          console.log("satt", newTitle);
         // console.log("name is",consumer_name)
          //var newUsername =consumer_name.users[0].displayName
          
      //     const titleName =`query MyQuery {
      //       mst_posts(where: {id: {_eq: "${postID}"}}) {
      //         title
      //       }
      //     }`
      //  var newtitle =   await request(endpoint, titleName, null, {
      //       "x-hasura-admin-secret": adminSecret,
      //     })
      //     console.log("title",newtitle)
      //     var postTitle = newtitle.mst_posts[0].title
      //     console.log("newposttitle",postTitle)

          var noftication = `New repost ${newTitle} created by ${newUsername}`
          const data = `mutation MyMutation {
            insert_notification(objects: {post_id: "${postID}",notification_message: "${noftication}",user_id:"${userID}",ngo_id:"${newngoID}"}) {
              affected_rows
            }
          }
          `;
            request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
              .then((data) =>
                res.json("notification added successfully"))
                .catch((error) =>{
                  console.log("the error is",error)
                  res.json({
                    error
                  })
                })
                
      }
       }catch(err){
        console.log(err)
       }
  }  

exports.deleteimage=  async (req, res) => {
    //var foldername = req.body.foldername
    cloudinary.config({
      cloud_name: "ds5q63dpl",
      api_key: "218362262478587",
      api_secret: "sDTT67H-ozKMry3aQHX9qRk9ueE",
    });
  
    const imageUrl = req.body.imageUrl
    const publicId = imageUrl.split('/').slice(-3).join('/').split('.')[0];
  
    console.log(publicId)
  
  
    cloudinary.uploader.destroy(publicId, function (error, result) {
      if (error) {
        console.log('Error deleting image:', error);
        res.json({
          message: "'Error In deleting image",
          error
        })
      } else {
        console.log('Image deleted successfully:', result);
        res.json({
          message: "The Image Is Deleted Successfully",
          result
        })
      }
    })
  }  

exports.deleteallimage=  (req, res) => {
    var foldername = req.body.foldername;
    cloudinary.config({
      cloud_name: "ds5q63dpl",
      api_key: "218362262478587",
      api_secret: "sDTT67H-ozKMry3aQHX9qRk9ueE",
    });
    cloudinary.api.delete_resources_by_prefix(foldername, {
      type: 'upload',
      resource_type: 'image'
    }, function (error, result) {
      if (error) {
        console.log('Error deleting folder:', error.message);
        res.json({
          message: "Some Error",
          error
        })
      } else {
        console.log('Folder deleted successfully:', result);
        res.json({
          message: "deleted successfully",
          result
        })
      }
    });
  }

  // async function sendNotificationEvenetCreation(devicetoken, noftication) {
  //   console.log("manoj");
  
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

// exports.appProjectNotifucation =async (req,res)=>{
//   try{
//   console.log("saran",req.body)
//   var ngoID = req.body.ngoid
//   var newArray =[];
//   var loopData;
//   const updateNgostatus = `mutation MyMutation {
//     update_mst__ngos(where: {id: {_eq: "${ngoID}"}}, _set: {project_notification_status: true}) {
//       affected_rows
//     }
//   }`;
//  var ngostatus= await request(endpoint,  updateNgostatus, null, {
//     "x-hasura-admin-secret": adminSecret,
//   })
//   console.log(ngostatus)
//   var ngoprojectStatus = `query MyQuery {
//     mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
//       project_notification_status
//       mst__projects(where: {ngo_id: {_eq: "${ngoID}"}}) {
//         id
//       }
//     }
//   }`
//   var getNgostatus= await request(endpoint,  ngoprojectStatus, null, {
//     "x-hasura-admin-secret": adminSecret,
//   })
//   console.log("jii",getNgostatus)
//      //console.log(getNgostatus.mst__ngos[0].project_notification_status)
//      if(getNgostatus.mst__ngos.length === 0){
//       console.log("saran")
//       res.status(500).send({
//         'Success': false, 'message': 'Incorrect ngo id',
//       })
//     }
//     else if (getNgostatus.mst__ngos[0].mst__projects.length === 0){
//       console.log("welcome")
//       res.status(500).send({
//         'Success': false, 'message': 'No project created in this ngo',
//       })     
// }
//   //console.log(getNgostatus.mst__ngos[0].mst__projects)
//   else{
//     let notificationDataFound = false;
//   for (j of getNgostatus.mst__ngos[0].mst__projects ){
//      var checkStatus = getNgostatus.mst__ngos[0].project_notification_status
//          var projectId =  j.id
//          console.log(projectId)
//          if(checkStatus == true){
//           console.log("coming")
//         var ngoNotification =await `query MyQuery {
//          notification(where: {project_id: {_eq: "${projectId}"}}) {
//            notification_message
//          }
//        }`  
//        var getNotification= await request(endpoint,ngoNotification, null, {
//          "x-hasura-admin-secret": adminSecret,
//        })
//    console.log("notifi",getNotification)
//    if(getNotification.notification.length !== 0){
//     console.log("coming if statement")
//     notificationDataFound = true;
//   }
  
//    for(i of getNotification.notification){
//      //console.log(i.notification_message)
//     await newArray.push(i.notification_message)
//     }
//   }
// }
// if (notificationDataFound) {
//   // Send the response here, outside of the loop, as notifications were found
//   res.status(200).send({
//     Success: true,
//     message: "Notification data fetched successfully",
//     newArray: newArray,
//   });
//  }
//  else {
//   // Send the response here, outside of the loop, as no notifications were found
//   res.status(200).send({
//     Success: false,
//     message: "No project notification data in this ngo",
//   });
// }
//  }
// }catch(error){
//   console.error(error);
//   res.status(500).send({
//     Success: false,
//     message: "An error occurred",
//   })
//  }
// }

// exports.apppostNotifucation =async (req,res)=>{
//   try{
//    console.log(req.body)
//    var ngoID = req.body.ngoid
//   var newArray =[];
//   var loopData;
//   const updateNgostatus = `mutation MyMutation {
//     update_mst__ngos(where: {id: {_eq: "${ngoID}"}}, _set: {post_notification_status: true}) {
//       affected_rows
//     }
//   }`;
 
//  var ngostatus= await request(endpoint,  updateNgostatus, null, {
//     "x-hasura-admin-secret": adminSecret,
//   })
//   console.log(ngostatus)
//   var ngoprojectStatus = `query MyQuery {
//     mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
//       post_notification_status
//       mst_posts(where: {ngo_id: {_eq: "${ngoID}"}}) {
//         id
//       }
//     }
//   }`
//   var getNgostatus= await request(endpoint,  ngoprojectStatus, null, {
//     "x-hasura-admin-secret": adminSecret,
//   })
//   //console.log("sarararra",getNgostatus.mst__ngos[0].mst_posts)
//   if(getNgostatus.mst__ngos.length === 0){
//     console.log("saran")
//     res.status(500).send({
//       'Success': false, 'message': 'Incorrect ngo id',
//     })
//   }
//   else if (getNgostatus.mst__ngos[0].mst_posts.length === 0){
//         console.log("welcome")
//         res.status(500).send({
//           'Success': false, 'message': 'No post created in this ngo',
//         })     
//   }
//   else{
//     let notificationDataFound = false;
//   for (j of getNgostatus.mst__ngos[0].mst_posts ){
//        console.log(j.id)
//        var postId = j.id
//        var checkStatus = getNgostatus.mst__ngos[0].post_notification_status
// //console.log(checkStatus)
// if(checkStatus == true){
//   console.log("coming")
//   var ngoNotification =await `query MyQuery {
//     notification(where: {post_id: {_eq: "${postId}"}}) {
//       notification_message
//     }
//   }`  
//   var getNotification= await request(endpoint,ngoNotification, null, {
//     "x-hasura-admin-secret": adminSecret,
//   })
//   console.log(getNotification.notification)
//   if(getNotification.notification.length !== 0){
//     console.log("coming if statement")
//     notificationDataFound = true;
//     for(i of getNotification.notification){
//       // console.log(i.notification_message)
//       await newArray.push(i.notification_message)
//       }  
// }

//   }
//   }
//   if ( notificationDataFound) {
//     // Send the response here, outside of the loop, as notifications were found
//     res.status(200).send({
//       Success: true,
//       message: "Notification data fetched successfully",
//       newArray: newArray,
//     });
//   }else {
//     // Send the response with the newArray here
//     res.status(200).send({
//       Success: false,
//       message: "No post notification data in this ngo",
//     });
//   }
// }
// }catch(error){
//   console.error(error);
//     res.status(500).send({
//       Success: false,
//       message: "An error occurred",
//     })
// }
// }

// exports.projectfalseNotification = async (req,res)=>{
//   try{
//       var ngoID = req.body.ngoid;
//       const updateNgostatus = `mutation MyMutation {
//         update_mst__ngos(where: {id: {_eq: "${ngoID}"}}, _set: {project_notification_status: false}) {
//           affected_rows
//         }
//       }`;
     
//      var ngostatus= await request(endpoint,updateNgostatus, null, {
//         "x-hasura-admin-secret": adminSecret,
//       })
//       res.status(200).send({
//         Success: true,
//         message: "Please turn on your project notification allow button",
//       });
//   }catch(error){
//     console.log(error)
//     res.status(500).send({
//       Success: false,
//       message: "An error occurred",
//     })
//   }
// }

// exports.customerNotification = async (req,res)=>{
//    try{
//        console.log("data is coming",req.body.event.data.new)
//      var inboxID = req.body.event.data.new.id
//      var inboxMessage = req.body.event.data.new.message
//      var userID = req.body.event.data.new.user_id
//      console.log("id=",inboxID)
//      console.log("message=",inboxMessage)
//      const data = `mutation MyMutation {
//       insert_notification(objects: {post_id: "null",notification_message: "${inboxMessage}",user_id:"${userID}",ngo_id:"null"}) {
//         affected_rows
//       }
//     }
//     `;
//       request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
//         .then((data) =>
//           res.json("notification added successfully"))
//           .catch((error) =>{
//             console.log("the error is",error)
//             res.json({
//               error
//             })
//           })
//    }catch(error){
//     console.log(error)
//    }
// }

// exports.ticketNotification = async(req,res)=>{
//   try{
//        console.log("winning moment",req.body.event.data.new)
//        var ticketId=req.body.event.data.new.id;
//        var ngoID =req.body.event.data.new.ngo_id;
//        var postID = req.body.event.data.new.post_id; 
//        var projectID =req.body.event.data.new.project_id;
//        var userID =req.body.event.data.new. user_id
// const ngoName = `query MyQuery {
//   mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
//     name
//   }
// }`
// var ngoname = await request(endpoint, ngoName, null, {
//   "x-hasura-admin-secret": adminSecret,
// })
// console.log(ngoname. mst__ngos[0].name)
// var newNgoname =ngoname. mst__ngos[0].name
//        var noftication = `New ticket has been raised by ${newNgoname}`
//        const data = `mutation MyMutation {
//          insert_notification(objects: {post_id: "${postID}",project_id: "${projectID}",notification_message: "${noftication}",user_id:"${userID}",ngo_id:"${ngoID}"}) {
//            affected_rows
//          }
//        }
//        `;
//         await request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret })
//            .then((data) =>
//              res.json("notification added successfully"))
//              .catch((error) =>{
//                console.log("the error is",error)
//                res.json({
//                  error
//                })
//              })
               
//   }catch(error){
//     console.log(error);
//   }
// }

