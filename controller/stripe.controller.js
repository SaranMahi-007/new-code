const express = require('express')
const stripe = require('stripe')('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');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// exports.createcustomer = async (req, res) => {
//   try {
//     console.log("geting");
//     const token = await stripe.tokens.create({
//       card: {

//         number: req.body['card[number]'],
//         exp_month: req.body['card[exp_month]'],
//         exp_year: req.body['card[exp_year]'],
//         cvc: req.body['card[cvc]']
//       },
//     });

//     // Create a PaymentMethod from the token
//     // const paymentMethod = await stripe.paymentMethods.create({
//     //   type: 'card',
//     //   card: {
//     //     token: token.id
//     //   }
//     // });

//     // Create a customer and attach the PaymentMethod
//     const customer = await stripe.customers.create({
//       name: req.body.name,
//       // payment_method: paymentMethod.id

//     });
//     // await stripe.paymentMethods.attach(paymentMethod.id, {
//     //   customer: customer.id,
//     // });
//     // await stripe.customers.update(customer.id, {
//     //   invoice_settings: {
//     //     default_payment_method: paymentMethod.id
//     //   }
//     // });
//     const card = await stripe.customers.createSource(customer.id, {
//       source: token
//     });
//     res.json({
//       message: "customer creates successfull",
//       card,
//       customer,

//     })

//   }
//   catch (error) {
//     console.error('Error creating customer:', error);
//     res.json({
//       message: "Some Error",
//       error

//     })
//   }
// }


// exports.createcustomer = async (req, res) => {

//   try {
//     const token = await stripe.tokens.create({
//       card: {

//         number: req.body['card[number]'],
//         exp_month: req.body['card[exp_month]'],
//         exp_year: req.body['card[exp_year]'],
//         cvc: req.body['card[cvc]']
//       },
//     });
//     console.log("card token", token);
//     // Create a customer
//     const customer = await stripe.customers.create({
//       name: req.body.name,
//       // source: token // Specify the source parameter with the card token
//     });
//     const card = await stripe.customers.createSource(
//       customer.id,
//       { source: token.id }
//     );

//     res.json({
//       message: "customer creates successfull",
//       success: true, customer: customer,
//       card: card
//     });
//   } catch (error) {
//     console.error('Error creating customer:', error);
//     res.status(500).json({ error: 'Failed to create customer' });
//   }
// }

exports.createcustomer = async (req, res) => {

  try {
    const token = await stripe.tokens.create({
      card: {

        number: req.body['card[number]'],
        exp_month: req.body['card[exp_month]'],
        exp_year: req.body['card[exp_year]'],
        cvc: req.body['card[cvc]'],
        name: req.body.cardholder_name,

      },
    });
    console.log("card token", token);
    // Create a customer
    const customer = await stripe.customers.create({
      name: req.body.name,
      // source: token // Specify the source parameter with the card token
    });
    const card = await stripe.customers.createSource(
      customer.id,
      { source: token.id }
    );
    console.log(card)
    const updatedCustomer = await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: card.id
      }
    })
    res.json({
      message: "customer creates successfull",
      success: true, customer: updatedCustomer,
      card: card
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}

exports.createproduct = async (req, res) => {


  const createProductAndPrice = async () => {
    try {

      const product = await stripe.products.create({

        name: req.body.product_name

      });

      const price = await stripe.prices.create({
        unit_amount: req.body['default_price[unit_amount_decimal]'], // Price in the smallest currency unit (e.g., cents)
        currency: req.body['default_price[currency]'],
        product: product.id,
        recurring: {
          interval: 'month',
        },

      });

      console.log('Product created:', product);
      console.log('Price created:', price);

      const token = await stripe.tokens.create({
        card: {

          number: req.body['card[number]'],
          exp_month: req.body['card[exp_month]'],
          exp_year: req.body['card[exp_year]'],
          cvc: req.body['card[cvc]']
        },
      });

      // Create a PaymentMethod from the token
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          token: token.id
        }
      });

      // Create a customer and attach the PaymentMethod
      const customer = await stripe.customers.create({
        name: req.body.name,
        // payment_method: paymentMethod.id

      });
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id,
      });
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethod.id
        }
      });
      const startDate = Math.floor(Date.now() / 1000); // Replace with the desired start date   
      const endDate = Math.floor(new Date(req.body.cancel_at).getTime() / 1000);
      const cycle_Date = Math.floor(new Date(req.body.billing_cycle_anchor).getTime() / 1000);
      const appFee = req.body.appFee
      const applicationFeePercent = 10;
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          { price: price.id }, , // Replace with the actual price ID of the recurring price
        ],
        billing_cycle_anchor: cycle_Date,
        cancel_at: endDate,
        application_fee_percent: appFee,
        metadata: {
          gift_aid_amount: req.body.gift_aid_amount, // Replace with the actual gift aid amount value
        },
      });
      res.json({
        message: "creates successfull",
        price,
        product,
        paymentMethod,
        customer,
        subscription
      })
    } catch (error) {
      console.error('Error creating product and price:', error);
      res.json({
        message: "Some Error",
        error

      })
    }
  };

  createProductAndPrice();
}

exports.createsubscription = async (req, res) => {
  try {
    const currentDate = new Date();
    const startDate = Math.floor(Date.now() / 1000); // Replace with the desired start date   
    const endDate = Math.floor(new Date(req.body.cancel_at).getTime() / 1000);
    const cycle_Date = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours (1 day)
    // const metadata = {
    //   gift_amount:req.body.gift_amount,
    //   appfee:req.body.appfee,
    //   ngo_id:req.body.ngo_id
    // };
    //const metadata = req.body.metadata;
    const metadata = JSON.parse(req.body.metadata);
    const giftAmount = metadata.gift_amount;
    const appfee = metadata.appfee;
    const ngoId = metadata.ngo_id;
    const metauserId = metadata.user_id
    const newdata = {
      giftAmount: giftAmount,
      appfee: appfee,
      ngoId: ngoId,
      userId: metauserId
    }

    console.log(metadata);
    console.log("newdata", newdata)
    const subscription = await stripe.subscriptions.create({
      customer: req.body.customerId,
      items: [
        { price: req.body.priceId, quantity: req.body.quantity }, , // Replace with the actual price ID of the recurring price
      ],
      billing_cycle_anchor: cycle_Date,
      cancel_at: endDate,
      metadata: newdata

    });
    res.json({
      message: "subscription creates successfull",
      subscription

    })
  }
  catch (error) {
    console.error('Error creating Subscription:', error);
    res.json({
      message: "Some Error",
      error

    })
  }
}

exports.cancelsubscription = async (req, res) => {
  const subscriptionId = req.body.subscription_id

  stripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: true },
    function (err, subscription) {
      if (err) {
        console.error(err);
        res.status(500).send({
          'Success': false, 'message': 'your Subscription Is Not Delete', err
        })
      } else {
        console.log('Subscription Deleted Successfully:', subscription.id);
        res.status(200).send({
          'Success': true, 'message': 'Subscription Deleted Successfully', subscription
        })

      }
    }
  );
}

// app.post('/webhook' = express.raw({ type: 'application/json' }), async (req, res) => {
//     //const sig = request.headers['stripe-signature'];

//     const event =req.body
//     console.log("sig", sig);
//     console.log("req", event)


//     // event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);


//     try {
//       const recurringJson = JSON.stringify(event);
//       let test = '"' + recurringJson + '"'
//        const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
//       const recurringData =`mutation MyMutation {
//           insert_testing_recurring(objects: {recurring_data: "${event}"}) {
//             affected_rows
//           }
//         }`
//       await request(endpoint, recurringData, null, {
//         "x-hasura-admin-secret": adminSecret,
//       }).then((data) => {
//         console.log("data",data)
//       })
//       if (event.type === 'invoice.payment_succeeded') {

//       } else if (event.type === 'payment_intent.payment_failed') {

//       } else {
//         console.log(`Unhandled event type ${event.type}`);
//       }
//       res.status(200).send("Ok");
//     } catch (err) {
//       res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//   });  

exports.changecard = async (req, res) => {
  try {
    const token = await stripe.tokens.create({
      card: {

        number: req.body['card[number]'],
        exp_month: req.body['card[exp_month]'],
        exp_year: req.body['card[exp_year]'],
        cvc: req.body['card[cvc]']
      },
    });

    // Create a PaymentMethod from the token
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: token.id
      }
    });
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: req.body.costomerId,
    });
    await stripe.customers.update(req.body.costomerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id
      }
    });
    res.json({
      message: "customer creates successfull",
      paymentMethod

    })
  }
  catch (error) {
    console.error('Error chage card data :', error);
    res.json({
      message: "Some Error",
      error

    })
  }
}

exports.createaccount = async (req, res) => {
  const cardPaymentsRequested = true;
  const transfersRequested = true;
  try {
    const account = await stripe.accounts.create({
      type: 'custom',
      country: req.body.country,
      email: req.body.email,
      business_type: req.body.business_type,
      capabilities: {
        card_payments: { requested: cardPaymentsRequested },
        transfers: { requested: transfersRequested },
      },

      business_profile: {
        mcc: req.body['business_profile[mcc]'],
        url: req.body['business_profile[url]'],

      },
      tos_acceptance: {
        date: parseInt(req.body['tos_acceptance[date]']),
        ip: req.body['tos_acceptance[ip]'],
      },



    })
    console.log(" Account created successfully:", account.id)
    const personData = {
      email: req.body.email,
      phone: req.body.phone,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      relationship: {
        representative: true,
        director: true,
        executive: true,
        owner: true,
        percent_ownership: 25,
        title: 'persontitle',
      },
      address: {
        line1: req.body['address[line1]'],
        line2: req.body['address[line2]'],
        city: req.body['address[city]'],
        postal_code: req.body['address[postal_code]'],
        state: req.body['address[state]'],
        country: req.body['address[country]']
      },
      dob: {
        day: req.body['dob[day]'],
        month: req.body['dob[month]'],
        year: req.body['dob[year]'],
      },


    };
    const person = await stripe.accounts.createPerson(account.id, personData);

    const bankAccountData = {
      external_account: {
        object: 'bank_account',
        account_number: req.body['external_account[account_number]'],
        country: req.body['external_account[country]'],
        currency: req.body['external_account[currency]'],
        // Add other bank account details as needed
      },
    };

    const bankAccount = await stripe.accounts.createExternalAccount(account.id, bankAccountData);




    res.json({
      message: "account and person created successfully",
      person,
      bankAccount
    })
  } catch (error) {
    console.log(error)

    res.json({
      error
    })
  }
};

exports.createtransfer = async (req, res) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: req.body.amount, // Amount in cents (e.g., $10.00)
      currency: req.body.currency, // Currency code
      destination: req.body.destination, // The Stripe account ID where the funds should be transferred
      description: req.body.destination, // Optional description for the transfer
    });

    console.log(transfer);
    res.status(200).send({
      'Success': true, 'message': 'transaction is successfull', transfer
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      'Success': false, 'message': ' You have insufficient funds in your Stripe account',
    })
  }
}

exports.createindividualproduct = async (req, res) => {
  try {
    var productType = req.body.product_type
    console.log("manoj", typeof (productType));
    const product = await stripe.products.create({

      name: req.body.product_name,
      metadata: {
        product_type: productType, // Replace with the actual gift aid amount value
      },



    });



    const monthlyPrice = await stripe.prices.create({
      // unit_amount: req.body['default_price[unit_amount_decimal]'], // Price in the smallest currency unit (e.g., cents)
      unit_amount: "100", // Price in the smallest currency unit (e.g., cents)
      // currency: req.body['default_price[currency]'],
      currency: "gbp",
      product: product.id,
      recurring: {
        interval: 'month',
      },
    });
    const weeklyPrice = await stripe.prices.create({
      // unit_amount: req.body['default_price[unit_amount_decimal]'], // Price in the smallest currency unit (e.g., cents)
      unit_amount: "100", // Price in the smallest currency unit (e.g., cents)
      // currency: req.body['default_price[currency]'],
      currency: "gbp",
      product: product.id,
      recurring: {
        interval: 'week',
      },
    });
    const dailyPrice = await stripe.prices.create({
      // unit_amount: req.body['default_price[unit_amount_decimal]'], // Price in the smallest currency unit (e.g., cents)
      unit_amount: "100", // Price in the smallest currency unit (e.g., cents)
      // currency: req.body['default_price[currency]'],
      currency: "gbp",
      product: product.id,
      recurring: {
        interval: 'day',
      },
    });
    const yearlyPrice = await stripe.prices.create({
      // unit_amount: req.body['default_price[unit_amount_decimal]'], // Price in the smallest currency unit (e.g., cents)
      unit_amount: "100", // Price in the smallest currency unit (e.g., cents)
      // currency: req.body['default_price[currency]'],
      currency: "gbp",
      product: product.id,
      recurring: {
        interval: 'year',
      },
    });




    console.log('Product created:', product);



    res.json({
      message: "creates successfull",
      monthlyPrice,
      weeklyPrice,
      dailyPrice,
      yearlyPrice,
      product

    })

  }
  catch (error) {
    console.error('Error creating product and price:', error);
    res.json({
      message: "Some Error",
      error

    })
  }
}


exports.createindividualsubscription = async (req, res) => {
  try {
    console.log("start");
    var request = req.body
    // Retrieve all products from Stripe
    const products = await stripe.products.list();

    // Find the product that matches the given name
    const product = products.data.find((p) => p.name === req.body.ngo_id);

    if (!product) {
      // throw new Error(`Product "${req.body.ngo_id}" not found.`);
      return res.status(400).json({
        message: `Product ${req.body.ngo_id} not found.`,

      })
    }
    // Assuming 1 GBP = 100 units
    const exchangeRate = 100;

    // Convert the UK amount to "unite" amount
    const uniteAmount = req.body.amount * exchangeRate;
    console.log("uniteAmount", uniteAmount);
    if (req.body.subscription_type === "daily") {
      const dailyPrice = await stripe.prices.create({
        unit_amount: uniteAmount,
        currency: "gbp",
        product: product.id,
        recurring: {
          interval: 'day',
        },
      });
      var priceId = dailyPrice.id



      var subscription = await subscriptionCreation(request, priceId)
      console.log("subscription", subscription);
      res.json({
        message: "subscription creates successfull",
        subscription

      })
    }
    else if (req.body.subscription_type === "weekly") {
      const weeklyPrice = await stripe.prices.create({
        unit_amount: uniteAmount,
        currency: "gbp",
        product: product.id,
        recurring: {
          interval: 'week',
        },
      });

      console.log("eeee", weeklyPrice);
      var priceId = weeklyPrice.id
      var subscription = await subscriptionCreation(request, priceId)
      console.log("subscription", subscription);
      res.json({
        message: "subscription creates successfull",
        subscription

      })
    } else if (req.body.subscription_type === "monthly") {
      const monthlyPrice = await stripe.prices.create({
        unit_amount: uniteAmount,
        currency: "gbp",
        product: product.id,
        recurring: {
          interval: 'month',
        },
      });
      var priceId = monthlyPrice.id

      const paymentLink = await stripe.paymentLinks.create({
        // amount: 10, // Amount in the smallest currency unit (e.g., cents for USD)
        currency: 'gbp',
        line_items: [{ price: priceId, quantity: 1 }],
        // Optional: You can set metadata for the payment link if needed
        metadata: {
          order_id: '12345',
        },
      });
      console.log("paymentLink", paymentLink);

      var subscription = await subscriptionCreation(request, priceId)
      console.log("subscription", subscription);
      res.json({
        message: "subscription creates successfull",
        subscription

      })
    } else if (req.body.subscription_type === "yearly") {
      const yearlyPrice = await stripe.prices.create({
        unit_amount: uniteAmount,
        currency: "gbp",
        product: product.id,
        recurring: {
          interval: 'year',
        },
      });
      var priceId = yearlyPrice.id
      var subscription = await subscriptionCreation(request, priceId)
      console.log("subscription", subscription);
      res.json({
        message: "subscription creates successfull",
        subscription

      })
    }
  }
  catch (error) {
    console.error('Error creating product and price:', error);
    res.json({
      message: "Some Error",
      error

    })
  }
}

async function subscriptionCreation(req, priceId) {
  console.log("req", req);

  const currentDate = new Date();
  const startDate = Math.floor(Date.now() / 1000); // Replace with the desired start date   
  const endDate = Math.floor(new Date(req.cancel_at).getTime() / 1000);
  const cycle_Date = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours (1 day)
  const metadata = JSON.parse(req.metadata);
  const giftAmount = metadata.gift_amount;
  const appfee = metadata.appfee;
  const ngoId = metadata.ngo_id;
  const metauserId = metadata.user_id
  const newdata = {
    giftAmount: giftAmount,
    appfee: appfee,
    ngoId: ngoId,
    userId: metauserId
  }

  console.log(metadata);
  console.log("newdata", newdata)
  const subscription = await stripe.subscriptions.create({
    customer: req.customerId,
    items: [
      { price: priceId, quantity: req.quantity }, // Replace with the actual price ID of the recurring price
    ],
    billing_cycle_anchor: cycle_Date,
    cancel_at: endDate,
    metadata: newdata

  });
  return subscription
}

// exports.addCardToCustomer = async (req, res) => {
//   try {
//     console.log("geting,addCardToCustomer");
//     const token = await stripe.tokens.create({
//       card: {

//         number: req.body['card[number]'],
//         exp_month: req.body['card[exp_month]'],
//         exp_year: req.body['card[exp_year]'],
//         cvc: req.body['card[cvc]']
//       },
//     });

//     // Create a PaymentMethod from the token
//     // const paymentMethod = await stripe.paymentMethods.create({
//     //   type: 'card',
//     //   card: {
//     //     token: token.id
//     //   }
//     // });

//     // Create a customer and attach the PaymentMethod

//     // await stripe.paymentMethods.attach(paymentMethod.id, {
//     //   customer: req.body.customerId,
//     // });
//     // await stripe.customers.update(req.body.customerId, {
//     //   invoice_settings: {
//     //     default_payment_method: paymentMethod.id
//     //   }
//     // });
//     const customer = await stripe.customers.retrieve(req.body.customerId);

//     const card = await stripe.customers.createSource(customer.id, {
//       source: token.id, // Card token generated by Stripe.js or Elements
//     });


//     res.json({
//       message: "customer new card added successfull",
//       card,

//     })

//   }
//   catch (error) {
//     console.error('Error creating customer:', error);
//     res.json({
//       message: "customer new card added process failed",
//       error

//     })
//   }
// }


exports.addCardToCustomer = async (req, res) => {
  try {
    console.log("geting,addCardToCustomer");
    const token = await stripe.tokens.create({
      card: {

        number: req.body['card[number]'],
        exp_month: req.body['card[exp_month]'],
        exp_year: req.body['card[exp_year]'],
        cvc: req.body['card[cvc]'],
        name: req.body.cardholder_name
      },
    });


    const customer = await stripe.customers.retrieve(req.body.customerId);

    const card = await stripe.customers.createSource(customer.id, {
      source: token.id, // Card token generated by Stripe.js or Elements
    });


    res.json({
      message: "customer new card added successfull",
      card,

    })

  }
  catch (error) {
    console.error('Error creating customer:', error);
    res.json({
      message: "customer new card added process failed",
      error

    })
  }
}

exports.getallCardToCustomer = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const customer = await stripe.customers.retrieve(customerId);
    // const paymentMethods = await stripe.paymentMethods.list({
    //   customer: customerId,
    //   type: 'card'
    // });
    // var cardDetails = paymentMethods.data
    // console.log("paymentMethods", paymentMethods);
    const cards = await stripe.customers.listSources(
      customerId,
      { object: 'card' }
    );
    res.json({
      message: "customer card details featch successfully",
      // paymentMethods.data
      cards
    })
  }
  catch (error) {
    console.error('Error chage card data :', error);
    res.json({
      message: "card details featch failer",
      error

    })
  }
}

exports.getCustomerDetails = async (req, res) => {
  try {
    console.log("get");
    const customerId = req.body.customerId;
    const customer = await stripe.customers.retrieve(customerId);
    console.log("customer", customer);
    // const paymentMethods = await stripe.paymentMethods({
    //   customer: customerId,
    //   type: 'card'
    // });
    const defaultCardId = customer.default_source;

    if (defaultCardId) {
      console.log("if");
      const card = await stripe.customers.retrieveSource(customerId, defaultCardId);
      console.log("card", card);
      res.json({
        message: "customer deatails fetch successfull",
        customer,
        card,

      })
    } else {
      throw new Error('No default card found for the customer.');
    }
  }
  catch (error) {
    console.error('Error on geting customer :', error);
    res.json({
      message: "customer details featch failer",
      error

    })
  }
}

exports.setDefaultCard = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const cardId = req.body.cardId
    const customer = await stripe.customers.retrieve(customerId);
    const updatedCustomer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: cardId
      }
    });
    res.json({
      message: `Default card set successfully for customer: ${updatedCustomer.id}`,
      // paymentMethods.data
      updatedCustomer
    })
    // console.log(`Default card set successfully for customer: ${updatedCustomer.id}`);
  }
  catch (error) {
    console.error('Error chage card data :', error);
    res.json({
      message: "defaultcard set failer",
      error

    })
  }
}

exports.removeProductAndType = async (req, res) => {
  try {
    console.log("removeProductAndType");
    var productId = req.body.productId
    await stripe.products.del(productId);

    console.log(`Product with ID ${productId} has been removed.`);

    // console.log(`Product with ID ${productId} and related prices have been removed.`);
    res.json({
      message: `Product with ID ${productId} has been removed.`,
    })
  }
  catch (error) {
    // console.error('Error chage card data :', error);
    res.json({
      message: "product and price removeing process failer",
      error

    })
  }
}

exports.deletecard = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const cardId = req.body.cardId

    const deleted = await stripe.customers.deleteSource(
      customerId,
      cardId
    );
    res.json({
      message: `card remove successfully for customer: ${customerId}`,
      // paymentMethods.data
      deleted
    })
  }
  catch (error) {
    // console.error('Error chage card data :', error);
    res.json({
      message: "removeing customer card process failer",
      error

    })
  }
}

exports.updatecard = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const cardId = req.body.cardId
    const card = await stripe.customers.updateSource(
      customerId,
      cardId,
      {
        name: req.body.name,
        address_city: req.body.address_city,
        address_country: req.body.address_country,
        address_line1: req.body.address_line1,
        address_line2: req.body.address_line2,
        address_state: req.body.address_state,
        address_zip: req.body.address_zip,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year
      }
    );
    res.json({
      message: `card update successfully for customer: ${customerId}`,
      // paymentMethods.data
      card
    })

  }
  catch (error) {
    // console.error('Error chage card data :', error);
    res.json({
      message: "update customer card process failer",
      error

    })
  }
}


exports.refundAmount = async (req, res) => {
  console.log("start");
  var paymentId = req.body.paymentId
  var amount = req.body.refundAmount
  try {
    const payment = await stripe.paymentIntents.retrieve(paymentId);

    // Create a refund for the specified amount
    const refund = await stripe.refunds.create({
      payment_intent: paymentId,
      amount: amount,
    });
    console.log('Refund processed successfully:', refund);
    res.json({
      message: `Refund processed successfully`,
      // paymentMethods.data
      refund
    })
  }
  catch (error) {
    // console.error('Error chage card data :', error);
    res.json({
      message: "payment refund process failer",
      error

    })
  }
}

exports.getproduct = async (req, res) => {
  try {
    // Retrieve all products from Stripe
    const products = await stripe.products.list();

    // Find the product that matches the given name
    const product = products.data.find((p) => p.name === req.body.ngo_id);

    if (!product) {
      throw new Error(`Product "${productName}" not found.`);
    }

    // Retrieve the prices associated with the product
    const prices = await stripe.prices.list({
      product: product.id,
    });

    // Return the product and prices
    res.json({
      message: `product details fetch successfully`,
      // paymentMethods.data
      product,
      prices: prices.data,
    })

  } catch (error) {
    throw new Error(`Error retrieving product details: ${error.message}`);
  }
}