const express = require("express");
const ngrok = require('ngrok');
const emailValidator = require('email-validator');
const PhoneNumber = require('libphonenumber-js');
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { stitchSchemas } = require("@graphql-tools/stitch");
const otpGenerator = require("otp-generator");
var bodyParser = require("body-parser");
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
const { client } = require("./client");
const { generateJWT } = require('./jwt')
const firebase = require('firebase-admin');
const path = require('path');
const fast2sms = require('fast-two-sms')
const cron = require('node-cron');



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



// firebase.initializeApp({
//   credential: firebase.credential.cert(accDetails)
// });
// const AWS = require('aws-sdk');

// AWS.config.update({
//   accessKeyId: 'AKIAVASOV7ZFQRQTDHV5',
//   secretAccessKey: 'YxyTveHh8elZBERQfSLwZ/bLb1HCjx2xKJRvLans',
//   region: 'us-west-2' // Replace with your desired AWS region
// });

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

bodyParser.raw({type: '*/*'})



const endpoint = "https://pockets-dev.digimeta.dev/v1/graphql";
const adminSecret = "Apid54as890vai67shu654na98vi";
const stripe = require('stripe')('sk_test_51N2mX3A7QWRv3a36P4d7OQVYeFeP3PY3FMqP1V2K0ziXzppdPmLHn6G9LzF1NSwRZd6N0PS8vuGUMGs51Fy0oEVy00IG5GQoRW');



//cors

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,application/octet-stream');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'application/octet-stream');


  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post("/createfolder", (req, res) => {
  var foldername = req.body.foldername;

  cloudinary.config({
    cloud_name: "hysas-tech",
    api_key: "723359333746999",
    api_secret: "jayyNpe6Rzgn5noXeDoLQSvrFZs",
  });

  cloudinary.api.create_folder(foldername, function (error, result) {
    if (error) {
      console.log("Error creating folder:", error.message);
      res.json({
        message: "An Error Accurad",
        error,
      });
    } else {
      console.log("Folder created successfully:", result);
      res.json({
        message: "Folder created successfully",
        result,
      });
    }
  });
});

app.post("/createimage", (req, res) => {
  console.log("saran")
  var foldername = req.body.foldername;
  var imageName = req.body.imageName;

  cloudinary.config({
    cloud_name: "hysas-tech",
    api_key: "723359333746999",
    api_secret: "jayyNpe6Rzgn5noXeDoLQSvrFZs",
  });

  cloudinary.uploader.upload(
    imageName,
    {
      folder: foldername,
    },
    function (error, result) {
      if (error) {
        console.log("Error uploading image:", error.message);
        res.json({
          message: "Error uploading image",
          error,
        });
      } else {
        console.log("Image uploaded successfully:", result);
        res.json({
          message: "Image uploaded successfully",
          result,
        });
      }
    }
  );
});


app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log("welcome")
  const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to the month since it is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
  //const sig = request.headers['stripe-signature'];

  const event =req.body
  //console.log("sig", sig);
 
 
 // event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
 
 
 try {
   const recurringJson = JSON.stringify(event).replace(/"/g, '\\"');
   //console.log(recurringJson)
   //const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
   // const recurringData =`mutation MyMutation {
     //   insert_testing_recurring(objects: { recurring_data: "${recurringJson}" }) {
       //     affected_rows
       //   }
       // }`
       // const recurringData=`mutation MyMutation {
         //   insert_mst__transactions(objects: {type: "${event.type}", total_amount: 10, payment_method: "${event.data.payment_method}", transaction_date: "07-06-23", is_active: true, gift_aid_amount: 10, donation_amount: 10, app_fee_amount: 10, payment_mode: "card"}) {
           //     affected_rows
           //   }
           // }`
           // await request(endpoint, recurringData, null, {
             //   "x-hasura-admin-secret": adminSecret,
             // }).then((data) => {
               //   console.log("data",data)
               // })
               console.log("req", event.data.object.lines.data[0].metadata.appfee)
               
    if (event.type === 'invoice.payment_succeeded') {
      console.log("saran")
      const recurringData=`mutation MyMutation {
            
                            insert_mst__transactions(objects: {type:"${event.data.object.lines.data[0].price.type}", total_amount: "${event.data.object.amount_paid}", payment_method: "${event.data.object.billing_reason}", transaction_date: "${formattedDate}", is_active:true, gift_aid_amount:"${event.data.object.lines.data[0].metadata.giftAmount}", donation_amount:"0", 
                            app_fee_amount:"${event.data.object.lines.data[0].metadata.appfee}", 
                            payment_mode: "automatic",ngo_id:"${event.data.object.lines.data[0].metadata.ngoId}",user_id:"${event.data.object.lines.data[0].metadata.userId}"}) {
          affected_rows
        }
      }`
      await request(endpoint, recurringData, null, {
        "x-hasura-admin-secret": adminSecret,
      }).then((data) => {
        console.log("data",data)
      })
    } else if (event.type === 'payment_intent.payment_failed') {

    } else {
      console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send("Ok");
  } catch (err) {
    console.log(err)
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});


app.post("/bank/update", async (req, res) => {
  var consumer_email
  var country_Name
  var counName
  try {
    //console.log(req.body)
    if (req.body.event.op == "INSERT") {
      var ngoID = req.body.event.data.new.ngo_id
      //console.log("ngiId",ngoID)
      var ngoEmailId = `query MyQuery {
        mst__ngos(where: {id: {_eq: "${ngoID}"}}) { 
          email_id
        }
      }`;
      await request(endpoint, ngoEmailId, null, {
        "x-hasura-admin-secret": adminSecret,
      }).then(async (emaildata) => {
        consumer_email = emaildata;
      });
      //console.log("email",consumer_email)
      var newEmail = consumer_email.mst__ngos[0].email_id
      //console.log("newemail",newEmail)
      const countryName = `query MyQuery {
        mst__ngos(where: {id: {_eq: "${ngoID}"}}) {
          country
        }
      }
      `;
      await request(endpoint, countryName, null, { "x-hasura-admin-secret": adminSecret }).then(async (countrydata) => {
        country_Name = countrydata;
      });
      console.log(country_Name)
      var countryID = country_Name.mst__ngos[0].country
      console.log("id", countryID)
      const data = `query MyQuery {
          mst__countrys(where: {id: {_eq: "${countryID}"}}) {
            name
          }
        }
        `;
      await request(endpoint, data, null, { "x-hasura-admin-secret": adminSecret }).then(async (cName) => {
        counName = cName
        console.log("name", cName)
      });
      console.log("ngoname", counName)
      var newCounname = counName.mst__countrys[0].name

      // console.log("cccname",newCounname)

      stripe.accounts.create({
        type: req.body.event.data.new.type,

        email: newEmail,
        country: 'GB',
      }).then(account => {
        console.log(account);
        // Redirect the user to the account setup page
        //res.redirect(account.url);
      }).catch(error => {
        console.error(error);

      })

    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing your request");
  }
})

app.get("/", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

cron.schedule('0 6 * * *', () => {
  console.log('Cron job is running at 6 AM!');

  // Process payments
  processPayments();
});

const processPayments = async () => {
  try {


    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to the month since it is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    console.log("formattedDate", formattedDate);

    var scheduleDate = `query MyQuery {
  mst_schedule_recuring_payment(where: {custom_date: {_eq: "${formattedDate}"}}) {
    user_id
    donation_amount
    custom_date
    id
    ngo_id
    payment_method
    gift_aid_amount
    app_fee
  }
}`
    var getScheduleData = await request(endpoint, scheduleDate, null, { "x-hasura-admin-secret": adminSecret })
    console.log("getScheduleData", getScheduleData);


    if (getScheduleData.mst_schedule_recuring_payment[0] ? getScheduleData.mst_schedule_recuring_payment[0].custom_date : "") {
      for (const customerUserId of getScheduleData.mst_schedule_recuring_payment) {
        console.log("customerUserId", customerUserId.donation_amount);
        console.log("break");
        var amount = customerUserId.donation_amount

        var userData = `query MyQuery {
        users(where: {id: {_eq: "${customerUserId.user_id}"}}) {
          metadata
        }
      }`
        var getUserData = await request(endpoint, userData, null, { "x-hasura-admin-secret": adminSecret })
        console.log("getUserData", getUserData.users[0]);
        // console.log("getUserData", getUserData);
        console.log("break 2");
        // Retrieve the customer from Stripe
        const customer = await stripe.customers.retrieve(getUserData.users[0].metadata.customerId);
        console.log("customer", customer);
        console.log("getScheduleData.mst_schedule_recuring_payment[0].ngo_id", getScheduleData.mst_schedule_recuring_payment[0].app_fee);
        // Check if the customer has a payment method attached
        if (!customer.invoice_settings.default_payment_method) {
          console.error(`No payment method found for customer: ${getUserData.users[0].metadata.customerId}`);
          continue;
        }

        // Create a payment intent in Stripe
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'gbp',
          customer: getUserData.users[0].metadata.customerId,
          payment_method: customer.invoice_settings.default_payment_method,
          off_session: true,
          confirm: true,
        });

        console.log(`Payment deducted successfully for customer: ${getUserData.users[0].metadata.customerId}`);
        console.log("paymentIntent", paymentIntent);
        var transactionData = `mutation MyMutation {
        insert_mst__transactions(objects: {donation_amount: "${amount}",ngo_id:"${getScheduleData.mst_schedule_recuring_payment[0].ngo_id}",payment_method:"${getScheduleData.mst_schedule_recuring_payment[0].payment_method}", payment_mode: "card", payment_status: "${paymentIntent.status}", user_id: "${customerUserId.user_id}", type: "${paymentIntent.confirmation_method}", total_amount: ${paymentIntent.amount_received}, transaction_date: "${formattedDate}", is_active: true, gift_aid_amount:"${getScheduleData.mst_schedule_recuring_payment[0].app_fee}", app_fee_amount:"${getScheduleData.mst_schedule_recuring_payment[0].gift_aid_amount}"}) {
          affected_rows
        }
      }`
        //   `mutation MyMutation {
        //   insert_mst__transactions(objects: {donation_amount: 50, payment_method: "pm_1NFXeEA7QWRv3a36WlPrja4O", payment_mode: "card", payment_status: "succeeded", user_id: "9ff667ff-e2a0-4505-9532-410acb13c876", type: "automatic", total_amount: 50, transaction_date: "2023-06-05", is_active: true, gift_aid_amount: 0, app_fee_amount: 5}) {
        //     affected_rows
        //   }
        // }`
        var storeTransactionData = await request(endpoint, transactionData, null, { "x-hasura-admin-secret": adminSecret })
      }


    } else {
      console.log(`datas not in ${formattedDate} this date`);
    }
  }
  catch (error) {
    console.error('Error fetching data from Hazura table:', error.message);
  }
};

const userRoute =require('./router/user.router')
const stripeRoute = require('./router/stripe.route')
const ngoRoute = require('./router/ngoorg.router')
const notificationRoute = require('./router/notification.route')

app.use(userRoute)
app.use(stripeRoute)
app.use(ngoRoute)
app.use(notificationRoute)

app.listen(4000, () => {
  console.log("server start at successfully 4000");
});


