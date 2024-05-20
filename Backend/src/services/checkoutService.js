import db from '../models/index.js'
import { getUserIdFromToken } from '../utilities/authentication.js'
import { facetStage } from './userService.js'
import NotificationEnum from '../enums/notification-type-enum.js'
import { sendNotification } from '../notification/sendNotification.js'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import { orderSellerNotificationEmail, orderBuyerNotificationEmail } from './emailService.js'
import NotificationMessage from '../enums/notification-message.js'
import moment from 'moment'

dotenv.config()
const stripe = new Stripe(process.env.SECRET_KEY, { apiVersion: '2023-08-16' })

const createCheckout = async (req, payment) => {
    const { delivery_charges, service_charges, total, products, payment_method } = req.body
    const u_id = await getUserIdFromToken(req)
    let user = await db.User.findOne({ where: { id: u_id }, raw: true })
    let product_id = []
    let product_details
    products.map(async (p) => {
        product_id.push(p.id)
        product_details = await db.UserProducts.findOne({
            where: {
                id: p.id
            },
            include: [
                {
                    model: db.User,
                    as: 'user_detail'
                }
            ]
        })

        if (u_id != product_details.u_id) {
            await db.notification.create({
                u_id: u_id,
                product_id: p.id,
                type: NotificationEnum.CHECK_OUT,
                f_id: product_details.u_id,
                message: NotificationEnum.CHECK_OUT
            })

            let check_email_notification = await db.notificationSetting.findOne({
                where: {
                    u_id: product_details.u_id
                },
                raw: true
            })

            if (check_email_notification?.sms_notification == true) {
                // let user_that_like_post = await db.User.findOne({ where: { id: u_id }, raw: true })
                // let phone_of_owner_post = await db.User.findOne({ where: { id: product_details.u_id }, raw: true })
                // await smsNotification(phone_of_owner_post.phone, user_that_like_post.first_name, NotificationMessage.SOLD)
            }

            if (product_details?.user_detail?.fcm_token) {
                let message = {
                    token: product_details?.user_detail?.fcm_token,
                    notification: {
                        title: `CheckOut `,
                        body: `${user?.first_name + ' ' + user?.last_name} Checkout`
                    },
                    data: { data: JSON.stringify(product_details) }
                }
                await sendNotification(message)
            }
        }
    })

    let order_ids = ''
    let _createCheckout = await db.Checkout.create({
        u_id: u_id,
        delivery_charges: delivery_charges,
        service_charges: service_charges,
        total: total,
        payment_method: payment_method,
        status: 'COMPLETED',
        status_date: new Date()
    })

    products.map(async (d) => {
        if (d.quantity > 0) {
            const product = await db.Orders.create({
                product_id: d.id,
                charge_gamba:true,
                c_id: _createCheckout.id,

                quantity: d.quantity
            })

            const productDetail = await db.UserProducts.findOne({
                where: { id: d.id },
                raw: true
            })

            let _total = productDetail.discount > 0 ? (productDetail.price - (productDetail.discount / 100) * productDetail.price) * d.quantity : productDetail.price * d.quantity
            

            await db.Orders.update(
                { seller_id: productDetail.u_id, total: _total },
                {
                    where: {
                        id: product.dataValues.id
                    }
                }
            )
            order_ids = !order_ids ? product.dataValues.id : order_ids + ' | ' + product.dataValues.id
        }
    })
    await gambaPayment(payment.confirmationId, total, payment?.platformFee, _createCheckout.dataValues.id)

    const sellerGrouped = products.reduce((acc, item) => {
      acc[item.u_id] = (acc[item.u_id] || []).concat(item);
      return acc;
    }, {});
    try
    {
        
        for (const sellerId in sellerGrouped) {
          const sellerProducts = sellerGrouped[sellerId];      
          const sellerAccountNotification = await db.notificationSetting.findOne({where: { u_id: sellerId},raw: true})
          const sellerProductsFiltered = sellerProducts.map((product) => ({
            name: product.name,
            quantity: product.quantity,
            price: product.discountPrice,
            unit: product.unit,
            total: (product.quantity * product.discountPrice),
            image: product.images && product.images.length > 0 ? process.env.S3_URL + product.images[0] : ''
          }))
          if (sellerAccountNotification?.email_notification == true) {
              let user_that_buy_product = await db.User.findOne({ where: { id: u_id }, raw: true })
              let email_of_owner_product = await db.User.findOne({ where: { id: sellerId }, raw: true })


              await orderSellerNotificationEmail(
                  email_of_owner_product.email, 
                  email_of_owner_product.first_name + ' ' + email_of_owner_product.last_name,
                  user_that_buy_product.first_name + ' ' + user_that_buy_product.last_name,
                  _createCheckout.ref_id,
                  moment(_createCheckout.createdAt).format('MM-DD-YYYY'),
                  user_that_buy_product.address,
                  sellerProductsFiltered, (email_of_owner_product.address ?? ''), service_charges, delivery_charges, payment_method)
          }
        }
    }
    catch(er)
    {
    }

    try
    {
        const buyerAccountNotification = await db.notificationSetting.findOne({where: { u_id: u_id},raw: true})
        if (buyerAccountNotification?.email_notification == true) {
            let sellerProductsFiltered = []
            for (const sellerId in sellerGrouped) {
                const sellerProducts = sellerGrouped[sellerId];
                const email_of_owner_product = await db.User.findOne({ where: { id: sellerId }, raw: true })
                sellerProductsFiltered[email_of_owner_product.first_name + ' ' + email_of_owner_product.last_name] = { 
                    address: email_of_owner_product.address ?? '',
                    products: sellerProducts.map((product) => ({
                      name: product.name,
                      quantity: product.quantity,
                      price: product.discountPrice,
                      unit: product.unit,
                      total: (product.quantity * product.discountPrice),
                      image: product.images && product.images.length > 0 ? process.env.S3_URL + product.images[0] : ''
                    }))
                }
            }
        
            let user_that_buy_product = await db.User.findOne({ where: { id: u_id }, raw: true })
            await orderBuyerNotificationEmail(
                user_that_buy_product.email, 
                user_that_buy_product.first_name + ' ' + user_that_buy_product.last_name,
                _createCheckout.ref_id,
                moment(_createCheckout.createdAt).format('MM-DD-YYYY'),
                user_that_buy_product.address ?? '',
                sellerProductsFiltered, service_charges, delivery_charges, payment_method)
        }
    }
    catch(er)
    {
    }
    
    

    //this is used becuase in the front end need to generate bill after check out FM
    const response = await db.Checkout.findOne({
        where: { id: _createCheckout.id },
        order: [['createdAt', 'DESC']],
        include: [
            {
                association: 'order_products',
                include: [{ association: 'product_orders' }]
            },
        ],
    })
    return {
        data: { checkout: response },
        status: true,
        message: `Checkout Successfully`
    }
}

const updateCheckout = async (req) => {
    const { checkout_id } = req.params

    const { delivery_charges, service_charges, total, payment_method } = req.body
    const u_id = await getUserIdFromToken(req)

    await db.Checkout.findOne({
        where: { id: checkout_id, u_id: u_id }
    })

    let _updateCheckout = await db.Checkout.update(
        {
            delivery_charges: delivery_charges,
            service_charges: service_charges,
            total: total,
            payment_method: payment_method
        },
        {
            where: {
                id: checkout_id,
                u_id: u_id
            }
        }
    )
    if (_updateCheckout) {
        return {
            data: { checkoutUpdated: _updateCheckout },
            status: true,
            message: `Checkout updated successfully `
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const getOrders = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const { limit, offset } = await facetStage(req.query.page)

    const response = await db.Checkout.findAll({
        where: { u_id: u_id },
        order: [['createdAt', 'DESC']],
        include: [
            {
                association: 'order_products',
                include: [{ association: 'product_orders', include: [{ association: 'user' }] }]
            },
        ],
        offset: offset,
        limit: limit
    })

    if (response) {
        return {
            data: { orders: response },
            status: true,
            message: `get orders successfully `
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

// This is a simplified example function. You might need to adapt it to your data structure and logic.
const calculateTotalAmount = (sellersAndProducts) => {
    let totalAmount = 0;

    sellersAndProducts.forEach((sellerAndProduct) => {
        totalAmount += sellerAndProduct?.quantity * sellerAndProduct?.discountPrice;
    });

    return totalAmount;
}
const processPayment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { products, paymentMethodId, total } = req.body
        let customerData = await db.User.findOne({where: {id: u_id}, raw: true})
        const customer_id = await addCustomer(customerData)
        if (customer_id)
        {
            const totalAmount = calculateTotalAmount(products);
            const platformFee = Math.round((totalAmount * 0.10) * 100) /100; // 10% platform fee
            const connectedAccountAmount = totalAmount - platformFee;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(total * 100),
                currency: 'usd',
                payment_method: paymentMethodId,
                payment_method_types: ['card'],
                customer: customer_id   
    
            }).then(res => res).catch((err => {
                return {
                    status: false,
                    message: err
                }
            }));
            let transferResults = []
            for (let i = 0; i < products.length; i++) {
                let sellerAndProduct = products[i]
                if (sellerAndProduct?.user?.stripe_account_id) {
                    transferResults.push({
                        amount: ((Math.round(sellerAndProduct?.discountPrice * connectedAccountAmount / totalAmount * 100) /100) * 100) * sellerAndProduct?.quantity,
                        userId: sellerAndProduct?.user?.id,
                        transfer_group: paymentIntent.id,
                        description: `${customerData?.first_name} buy the product for Order # at ${moment().format('MM-DD-YYYY HH:mm')}`,
                        purchasedBy: customerData?.id,
                        dateDeposite: moment().add(4, 'days')
                    })
                }
            }

            if (transferResults.length && products.length) {
                let confirmationId = ''
                if (paymentIntent?.id) {
                    let confirmIntent = await stripe.paymentIntents.confirm(paymentIntent.id)
                    confirmationId = confirmIntent.latest_charge
                    if (!confirmIntent.id) {
                        return {
                            status: false,
                            message: 'Failed to confirm payment intent'
                        }
                    }
                }
                else
                {
                    return {
                        status: false,
                        message: paymentIntent?.message?.raw?.message
                    }
                }
                let payment = { is_payed: true, transferResults, platformFee, confirmationId : confirmationId }
                const checkOut = await createCheckout(req, payment)

                const pay = await stripe.paymentIntents.update(paymentIntent.id, { description: 
                    `${customerData?.first_name} buy the product for order #${checkOut.data.checkout.dataValues.id} at ${moment().format('MM-DD-YYYY HH:mm')}`, customer: customer_id });
                
                await transferResults.forEach(async (transfer) => {
                    try {
                      await db.pendingTransfers.create({
                        u_id: transfer.userId,
                        amount: transfer.amount,
                        transfer_group: transfer.transfer_group,
                        purchased_by_id: transfer.purchasedBy,
                        order_id : checkOut.data.checkout.dataValues.id,
                        dateDeposite: transfer.dateDeposite,
                        status: 'PENDING',
                        remarks: 'Waiting for process',
                      });
                    } catch (error) {
                      console.error('Error adding transfer record:', error);
                    }
                  });
                return {
                    status: true,
                    message: `payment successfull`
                }
            }
            else
            {
                return {
                    status: false,
                    message: `Some Seller Not Connected To Stripe`
                }
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const processCashOnDelivery = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let payment = { is_payed: true, transferResults:[], platformFee:0, confirmationId:''  }
        const checkOut = await createCheckout(req, payment)

        return checkOut
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const makePayment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { products, token, total } = req.body
        let customerData = await db.User.findOne({
            where: {
                id: u_id
            },
            raw: true
        })
        let createStripeCustomer = {
            email: customerData?.email,
            name: customerData?.first_name + ' ' + customerData?.last_name,
            phone: customerData?.phone
        }

        let customer

        const totalAmount = calculateTotalAmount(products);
        // Calculate the amounts for distribution
        const platformFee = Math.round(totalAmount * 0.10); // 10% platform fee
        const connectedAccountAmount = totalAmount - platformFee;

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: { token: token?.id },
        })
        const balance = await stripe.balance.retrieve();
        console.log('balance====', balance)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(totalAmount * 100),
            currency: 'usd',
            payment_method: paymentMethod?.id,
            payment_method_types: ['card'],
            // application_fee_amount: platformFee * 100


        }).then(res => res).catch((err => {
            return {
                status: false,
                message: err
            }
        }));

        if (paymentIntent?.id) {
            let confirmIntent = await stripe.paymentIntents.confirm(paymentIntent.id)
            if (!confirmIntent.id) {
                return {
                    status: false,
                    message: 'Failed to confirm payment intent'
                }
            }
        }

        let notConnectedAccounts = [], transferResults = []
        for (let i = 0; i < products.length; i++) {
            let sellerAndProduct = products[i]
            if (sellerAndProduct?.user?.stripe_account_id) {

                let connnectedAccount = await stripe.accounts.retrieve(sellerAndProduct?.user?.stripe_account_id)

                if (!connnectedAccount.charges_enabled) {
                    // console.log('======= connnectedAccount.charges_enabled', connnectedAccount.charges_enabled)
                    notConnectedAccounts.push(connnectedAccount.id)

                } else if (connnectedAccount.charges_enabled) {
                    if (customerData?.stripe_customer_id) {
                        // console.log('======= enter in if customer part', sellerAndProduct?.user?.stripe_account_id)
                        try {
                            customer = await stripe.customers
                                .retrieve(customerData.stripe_customer_id, {
                                    stripeAccount: sellerAndProduct?.user?.stripe_account_id
                                }).then(res => res).catch((err => {
                                    return {
                                        status: false,
                                        message: err
                                    }
                                }))
                            if (customer) {
                                await stripe.paymentMethods.attach(paymentMethod?.id, {
                                    customer: customer.id,
                                }).then(res => res).catch((err => {
                                    return {
                                        status: false,
                                        message: err
                                    }
                                }));
                            }


                        } catch (error) {

                            customer = await stripe.customers.create(
                                {
                                    ...createStripeCustomer,
                                    // payment_method: token
                                },
                                {
                                    stripeAccount: sellerAndProduct?.user?.stripe_account_id
                                }
                            ).then(res => res).catch((err => {
                                return {
                                    status: false,
                                    message: err
                                }
                            }))
                            if (customer.id) {
                                await stripe.paymentMethods.attach(paymentMethod?.id, {
                                    customer: customer.id,
                                }).then(res => res).catch((err => {
                                    return {
                                        status: false,
                                        message: err
                                    }
                                }));

                                await db.User.update(
                                    {
                                        stripe_customer_id: customer.id
                                    },
                                    {
                                        where: {
                                            id: customerData.id
                                        }
                                    }
                                )
                            }

                        }
                    } else {
                        // console.log('======= enter in else customer part', customer, createStripeCustomer, sellerAndProduct?.user?.stripe_account_id)
                        customer = await stripe.customers
                            .create(
                                {
                                    ...createStripeCustomer,
                                },
                                {
                                    stripeAccount: sellerAndProduct?.user?.stripe_account_id
                                }
                            ).then(res => res).catch((err => {
                                return {
                                    status: false,
                                    message: err
                                }
                            }))
                        if (customer) {
                            await stripe.paymentMethods.attach(paymentMethod?.id, {
                                customer: customer.id,
                            }).then(res => res).catch((err => {
                                return {
                                    status: false,
                                    message: err
                                }
                            }));

                            await db.User.update(
                                {
                                    stripe_customer_id: customer.id
                                },
                                {
                                    where: {
                                        id: customerData.id
                                    }
                                }
                            )
                        }

                    }

                    try {

                        await stripe.paymentIntents.update(paymentIntent.id, { description: `${customerData?.first_name} buy the product ${sellerAndProduct?.name} at ${moment().format('MM-DD-YYYY HH:mm')}`, customer: customer.id }).then(res => res).catch((err => {
                            return {
                                status: false,
                                message: err
                            }
                        }));


                        let transfer = await stripe.transfers.create({
                            amount: parseInt(Math.round(sellerAndProduct?.price * connectedAccountAmount / totalAmount) * 100),
                            currency: 'usd',
                            destination: sellerAndProduct?.user?.stripe_account_id,
                            transfer_group: paymentIntent.id, // Group transfers for the payment
                            description: `${customerData?.first_name} buy the product ${sellerAndProduct?.name} at ${moment().format('MM-DD-YYYY HH:mm')}`,
                        })

                        if (transfer.id) {
                            transferResults.push(transfer)
                        }
                    } catch (error) {
                        return {
                            status: false,
                            message: error
                        }
                    }



                }
            }
        }

        if (notConnectedAccounts.length && transferResults.length == 0) {
            return {

                status: false,
                message: `Transaction failed due to seller account payments not enabled on stripe`
            }
        }

        if (transferResults.length) {
            let payment = { is_payed: true, transferResults, platformFee, confirmationId:'' }
            await createCheckout(req, payment)
            return {
                data: { transferResults, notConnectedAccounts },
                status: true,
                message: `payment successfull`
            }
        }
        // products.map(async (product) => {
        // for (let i = 0; i < sellersAndProducts?.length; i++) {
        //     let product = sellersAndProducts[i]

        //     // const _token = await stripe.tokens.create(
        //     //     {
        //     //         customer: 'cus_OTRTqZCvpaG7FG',
        //     //         // card: token
        //     //     },
        //     //     {
        //     //         stripeAccount: product?.user?.stripe_account_id
        //     //     }
        //     // );

        //     // console.log('_token=====', _token)

        //     // const paymentMethod = await stripe.paymentMethods.create({
        //     //     type: 'card',
        //     //     card: { token },
        //     // }, { stripeAccount: product?.user?.stripe_account_id })

        //     // console.log('paymentMethod====', paymentMethod)


        //     if (customerData?.stripe_customer_id) {
        //         console.log('======= enter in if customer part', product?.user?.stripe_account_id)
        //         try {
        //             customer = await stripe.customers
        //                 .retrieve(customerData.stripe_customer_id, {
        //                     stripeAccount: product?.user?.stripe_account_id
        //                 })

        //             // await stripe.paymentMethods.attach(paymentmethod, {
        //             //     customer: customer.id,
        //             // });

        //         } catch (error) {

        //             customer = await stripe.customers.create(
        //                 {
        //                     ...createStripeCustomer,
        //                     // payment_method: token
        //                 },
        //                 {
        //                     stripeAccount: product?.user?.stripe_account_id
        //                 }
        //             )

        //             // await stripe.paymentMethods.attach(paymentmethod, {
        //             //     customer: customer.id,
        //             // });

        //             await db.User.update(
        //                 {
        //                     stripe_customer_id: customer.id
        //                 },
        //                 {
        //                     where: {
        //                         id: customerData.id
        //                     }
        //                 }
        //             )
        //         }
        //     } else {
        //         console.log('======= enter in else customer part', customer, createStripeCustomer, product?.user?.stripe_account_id)
        //         customer = await stripe.customers
        //             .create(
        //                 {
        //                     ...createStripeCustomer,
        //                     // stripeAccount: product?.user?.stripe_account_id
        //                     // payment_method: token
        //                 },
        //                 {
        //                     stripeAccount: product?.user?.stripe_account_id
        //                 }
        //             )

        //         // await stripe.paymentMethods.attach(paymentmethod, {
        //         //     customer: customer.id,
        //         // });

        //         await db.User.update(
        //             {
        //                 stripe_customer_id: customer.id
        //             },
        //             {
        //                 where: {
        //                     id: customerData.id
        //                 }
        //             }
        //         )
        //     }

        //     // console.log('======= customer retive', product?.user?.stripe_account_verified)
        //     if (product?.user?.stripe_account_verified) {

        //         const balance = await stripe.balance.retrieve()
        //         // await stripe.paymentMethods.attach(paymentmethod, {
        //         //     customer: 'customer_id_on_connected_account',
        //         // });

        //         const paymentIntent = await stripe.paymentIntents.create(
        //             {
        //                 amount: product?.quantity * product?.price * 100,
        //                 currency: 'usd',
        //                 payment_method_types: ['card'],
        //                 description: `${customerData?.first_name} buy these products ${product?.name} on ${moment().format('YYYY-MM-DD HH:mm')}`,
        //                 receipt_email: customerData?.email,
        //                 // application_fee_amount: 100,
        //                 customer: customer.id,
        //                 payment_method: paymentMethod.id,
        //                 // transfer_data: {
        //                 //     destination: product?.user?.stripe_account_id,
        //                 // },
        //             },
        //             {
        //                 stripeAccount: product?.user?.stripe_account_id
        //             }
        //         )

        //         console.log('======= ==s==s=s==s=ss', product?.user?.stripe_account_verified, balance, paymentIntent)

        //         // Transfer funds to seller's connected account
        //         const transfer = await stripe.transfers.create(
        //             {
        //                 amount: product?.price,
        //                 currency: 'usd',
        //                 destination: product?.user?.stripe_account_id,
        //                 transfer_group: paymentIntent.id,

        //             },
        //         )

        //         console.log('transfer===== 1', transfer)
        //         // let completePayment = await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: paymentmethod }, { stripeAccount: product?.user?.stripe_account_id })
        //         if (transfer) {

        //             return {
        //                 data: transfer, //client_secret
        //                 status: true,
        //                 message: `payment successfull`
        //             }
        //         }

        //     } else if (customer && product?.user?.stripe_account_verified) {
        //         console.log('======= ==s==s=s==s=ss', product?.user?.stripe_account_verified, balance, paymentIntent)

        //         const paymentIntent = await stripe.paymentIntents.create(
        //             {
        //                 amount: product?.quantity * product?.price * 100,
        //                 currency: 'usd',
        //                 payment_method_types: ['card'],
        //                 description: `${customerData?.first_name} buy these products ${product?.name} on ${moment().format('YYYY-MM-DD HH:mm')}`,
        //                 receipt_email: customerData?.email,
        //                 // application_fee_amount: 100,
        //                 customer: customer.id,
        //                 // payment_method: paymentmethod,
        //                 // transfer_data: {
        //                 //     destination: product?.user?.stripe_account_id,
        //                 // },
        //             },
        //             {
        //                 stripeAccount: product?.user?.stripe_account_id
        //             }
        //         )

        //         console.log('paymentIntent========', paymentIntent)

        //         // Transfer funds to seller's connected account
        //         const transfer = await stripe.transfers.create({
        //             amount: product?.quantity * product?.price * 100,
        //             currency: 'usd',
        //             destination: product?.user?.stripe_account_id,
        //             transfer_group: paymentIntent.id // Associate transfer with payment intent
        //         })

        //         console.log('transfer===== 2', transfer)
        //     }
        // }
        // })

        // const paymentIntents = await Promise.all(
        //     sellersAndProducts.map(async (sellerProduct) => {

        //       const paymentIntent = await stripe.paymentIntents.create({
        //         amount: productAmount,
        //         currency: 'usd',
        //         payment_method_types: ['card'],
        //       }, {
        //         stripeAccount: sellerConnectedAccountId,
        //       });

        //       // Transfer funds to seller's connected account
        //       const transfer = await stripe.transfers.create({
        //         amount: productAmount,
        //         currency: 'usd',
        //         destination: sellerConnectedAccountId,
        //         transfer_group: paymentIntent.id, // Associate transfer with payment intent
        //       });

        //       // return { paymentIntent, transfer };
        //     })
        //   );

        // console.log('sellersAndProducts====', sellersAndProducts, token)

        // if (!userProducts?.stripe_account_id && !userProducts?.stripe_account_verified) {
        //     return {
        //         status: false,
        //         message: 'User not linked with stripe!'
        //     }
        // }

        // if (!check_stripe_id.stripe_customer_id && userProducts?.stripe_account_verified) {
        //     customer_create = await stripe.customers.create(createStripeCustomer, {stripeAccount: userProducts?.stripe_account_id})
        //     console.log('8888', customer_create)
        //     paymentIntent = await stripe.paymentIntents.create(
        //         {
        //             amount: amount * 100,
        //             currency: 'usd',
        //             payment_method_types: ['card'],
        //             customer: customer_create.id
        //         },
        //         {stripeAccount: userProducts?.stripe_account_id}
        //     )
        // } else if (user_data.stripe_customer_id && userProducts?.stripe_account_verified) {
        //     console.log('else statement')
        //     let customer
        //     try {
        //         customer = await stripe.customers
        //             .retrieve(user_data.stripe_customer_id, {stripeAccount: userProducts?.stripe_account_id})
        //             .then((res) => res)
        //             .catch((ee) => console.log('error', ee))
        //     } catch (error) {
        //         console.log('==========ddd', customer)
        //     }

        //     if (!customer) {
        //         customer = await stripe.customers.create(createStripeCustomer, {stripeAccount: userProducts?.stripe_account_id})
        //         await db.User.update(
        //             {
        //                 stripe_customer_id: customer.id
        //             },
        //             {
        //                 where: {
        //                     email: user_data.email
        //                 }
        //             }
        //         )
        //     }
        //     paymentIntent = await stripe.paymentIntents.create(
        //         {
        //             amount: amount * 100,
        //             currency: 'usd',
        //             payment_method_types: ['card'],
        //             customer: customer?.id
        //         },
        //         {stripeAccount: userProducts?.stripe_account_id}
        //     )
        //     console.log('9999', user_data.stripe_customer_id)
        // }
        // if (!check_stripe_id.stripe_customer_id) {
        //     await db.User.update(
        //         {
        //             stripe_customer_id: paymentIntent.customer
        //         },
        //         {
        //             where: {
        //                 email: user_data.email
        //             }
        //         }
        //     )
        // }

        // return {
        //     data: {}, //client_secret
        //     status: true,
        //     message: `payment successfull`
        // }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}
const gambaPayment = async (confirmationId, total, gambaCharge, orderId) => {
    try {
        if (orderId) {
            const currentDate = moment()
            await db.paymentHistory.create({
                date_paid: currentDate,
                checkout_id: orderId,
                total: total,
                amount_paid_to_gamba: gambaCharge,
                confirmation_no: confirmationId,
                status: 'COMPLETED'
            })
        }
    } catch (error) {

    }
}

const connectToStripe = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const user = await db.User.findOne({ where: { id: u_id }, raw: true })
        if (user) {
            let stripe_id = user.stripe_account_id
            if (stripe_id)
            {
                await stripe.accounts.retrieve(stripe_id)
                .then(account => {
                    stripe_id = account.id
                })
                .catch(error => {
                  stripe_id = ''
                });
            }
            if (!stripe_id)
            {
                const stripeAccount = await stripe.accounts.create({ type: 'standard', country: 'US', email: user?.email })
                stripe_id = stripeAccount?.id
            }
            if (stripe_id) {
                await db.User.update({ stripe_account_id: stripe_id }, { where: { id: u_id } })
                return {
                    status: true,
                    message: 'User Linked with stripe successfull',
                    data: await stripe.accountLinks.create({ account: stripe_id, refresh_url: `${process.env.FRONTEND_URL}`, return_url: `${process.env.FRONTEND_URL}settings?status=stripe_return&account_id=${stripe_id}`, type: 'account_onboarding' })
                }
            } else {
                return {
                    status: false,
                    message: 'Failed to link with stripe'
                }
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const isMerchantConnected = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let customerData = await db.User.findOne({
            where: {
                id: u_id
            },
            raw: true
        })
        if (customerData && customerData.stripe_account_id)
        {
            const stripeAccount = await stripe.accounts.retrieve(customerData.stripe_account_id)
            if (stripeAccount.payouts_enabled) {
                await db.User.update({ stripe_account_verified: true }, { where: { id: u_id } })
                let user = await db.User.findOne({ where: { id: u_id } })
                return {
                    status: true,
                    message: 'User Linked with stripe successfull',
                    data: user
                }
            }
            return {
                status: false,
                message: 'User not linked with stripe'
            }
        }
        else
        {
            return {
                status: false,
                message: 'User not linked with stripe'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const retriveAccount = async (req) => {retriveAccount
    try {
        const u_id = await getUserIdFromToken(req)
        const { id } = req.body
        const stripeAccount = await stripe.accounts.retrieve(id)
        console.log('stripeAccount=====', stripeAccount)
        if (stripeAccount.payouts_enabled) {
            await db.User.update({ stripe_account_verified: true }, { where: { id: u_id } })
            let user = await db.User.findOne({ where: { id: u_id } })
            return {
                status: true,
                message: 'User Linked with stripe successfull',
                data: user
            }
        }
        return {
            status: false,
            message: 'User not linked with stripe'
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const removeConnectedAccount = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        let user = await db.User.findOne({ where: { id: u_id }, raw: true })
        if (user) {
            await db.User.update({ stripe_account_verified: false }, { where: { id: u_id } })
            user = await db.User.findOne({ where: { id: u_id }, attributes: { exclude: ['password'] }, raw: true })
            return {
                status: true,
                message: 'User De-Linked with stripe successfull',
                data: user
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const addCustomer = async (user) => {
    try {
        let customer_id = user.stripe_customer_id
        if (customer_id)
        {
            await stripe.customers.retrieve(customer_id)
            .then(customer => {
                customer_id = customer.deleted ? '' : customer.id
            })
            .catch(error => {
                customer_id = ''
            });
            
        }
        if (!customer_id)
        {
            await stripe.customers.create({
                email: user?.email,
                name: user?.first_name + ' ' + user?.last_name,
                phone: user?.phone,
                description: `Customer for user ${user?.id}`,
              })
              .then(customer => {
                  customer_id = customer.id
              })
              .catch(error => {
                  customer_id = ''
              });
              await db.User.update({ stripe_customer_id: customer_id }, { where: { id: user.id } })
        }
        return customer_id
    } catch (error) {
        console.log(error)
        throw error
    }
}

const addCard = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let user = await db.User.findOne({ where: { id: u_id }, raw: true })
        if (user) {
            const customer_id = await addCustomer(user)
            if (customer_id)
            {
                const { paymentMethodId } = req.body;
                await stripe.paymentMethods.attach(paymentMethodId, {
                    customer: customer_id,
                });
                return {
                    status: true,
                    message: 'card added successfully'
                }
            }
            else
            {
                return {
                    status: false,
                    message: 'failed to create customer on stripe'
                }
            }
        }
        else
        {
            return {
                status: false,
                message: 'User not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const myCards = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let user = await db.User.findOne({ where: { id: u_id }, raw: true })
        if (user) {
            if (user.stripe_customer_id)
            {
                const customer = await stripe.customers.retrieve(user.stripe_customer_id);
                const cards = await stripe.customers.listPaymentMethods(user.stripe_customer_id,{
                  type: 'card',
                });
                const defaultCard = cards.data.find(pm => pm.id === customer.invoice_settings?.default_payment_method);
                return {
                    status: true,
                    message: 'card details',
                    data: cards.data.map(pm => ({
                        id : pm.id,
                        brand : pm.card.brand,
                        last4 : pm.card.last4,
                        isDefault: pm.id === defaultCard?.id,
                      }))
                }
            }
            else
            {
                return {
                    status: true,
                    message: 'card not found',
                    data: []
                }
            }
        }
        else
        {
            return {
                status: false,
                message: 'User not found'
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: error
        }
    }
}

const changDefaultPayment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let user = await db.User.findOne({ where: { id: u_id }, raw: true })
        if (user && user.stripe_customer_id) {
            const customer_id = user.stripe_customer_id
            const { paymentMethodId } = req.body;
            await stripe.customers.update(customer_id, {
                invoice_settings: {
                    default_payment_method : paymentMethodId
                },
            });
            return {
                status: true,
                message: 'default card changed successfully'
            }
        }
        else
        {
            return {
                status: false,
                message: 'User not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

const deleteCard = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let user = await db.User.findOne({ where: { id: u_id }, raw: true })
        if (user && user.stripe_customer_id) {
            const  paymentMethodId = req.params.paymentMethodId;
            await stripe.paymentMethods.detach(paymentMethodId);
            return {
                status: true,
                message: 'payment method deleted successfully',
            }
        }
        else
        {
            return {
                status: false,
                message: 'User not found'
            }
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: error
        }
    }
}

const initializPayment = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const { amount, product_name, user_id, card_number, exp_year, exp_month, cvc } = req.body

        let user = await db.User.findOne({ where: { id: u_id }, raw: true })
        let userProducts = await db.User.findOne({ where: { id: user_id }, raw: true })

        if (!userProducts?.stripe_account_id && !userProducts?.stripe_account_verified) {
            return {
                status: false,
                message: 'User not linked with stripe!'
            }
        }

        let createStripeCustomer = {
            email: user?.email,
            name: user?.first_name + ' ' + user?.last_name,
            phone: user?.phone
        }
        // console.log('=======user', userProducts, user)

        // console.log('=======createCustomer', user?.stripe_customer_id, 'stripe_account_verified', userProducts?.stripe_account_verified, 'stripe_account_id', userProducts?.stripe_account_id)
        if (user) {
            if (user?.stripe_customer_id && userProducts?.stripe_account_verified && userProducts?.stripe_account_id) {
                let paymentIntent = await stripe.paymentIntents.create(
                    {
                        payment_method_types: ['card'],
                        amount: amount * 100,
                        currency: 'usd',
                        application_fee_amount: 100,
                        customer: user?.stripe_customer_id,
                        receipt_email: user?.email,
                        payment_method: 'pm_card_visa',

                        description: `${user?.first_name} buy these products ${product_name} on ${moment().format('MM-DD-YYYY HH:mm')}`
                    },
                    {
                        stripeAccount: userProducts?.stripe_account_id
                    }
                )

                // const token = await stripe.tokens.create({
                //     card: {
                //         number: '4242424242424242',
                //         exp_month: 8,
                //         exp_year: 2024,
                //         cvc: '314'
                //     }
                // })

                const newToken = await stripe.tokens
                    .create(
                        {
                            customer: user?.stripe_customer_id
                        },
                        {
                            stripe_account: userProducts?.stripe_account_id
                        }
                    )
                    .catch((e) => {
                        console.log(e)
                    })

                // console.log('====== paymentIntent', paymentIntent, card_number, exp_month, exp_year, cvc, newToken)

                const token = await stripe.tokens.create({
                    card: {
                        number: card_number,
                        exp_month: exp_month,
                        exp_year: exp_year,
                        cvc: cvc
                    }
                }, { stripeAccount: userProducts?.stripe_account_id });

                console.log('token==========', token)
                let createPaymentMethod = await stripe.paymentMethods.create(
                    {
                        type: 'card',
                        card: {
                            token: token.id
                        }
                    },
                    {
                        stripeAccount: userProducts?.stripe_account_id
                    }
                )
                console.log('====== createPaymentMethod', createPaymentMethod)

                let completePayment = await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: createPaymentMethod.id }, { stripeAccount: userProducts?.stripe_account_id })

                console.log('====== completePayment', completePayment)

                if (completePayment) {
                    return {
                        status: true,
                        message: 'Payment successfull, Thank you!',
                        data: completePayment
                    }
                } else {
                    return {
                        status: false,
                        message: 'Failed to initialize payment'
                    }
                }
            } else if (!user?.stripe_customer_id && userProducts?.stripe_account_verified && userProducts?.stripe_account_id) {
                console.log('=======createCustomer', user?.stripe_customer_id)
                let createCustomer = await stripe.customers.create(createStripeCustomer, { stripeAccount: userProducts?.stripe_account_id })
                console.log('=======createCustomer', createCustomer)
                await db.User.update({ stripe_customer_id: createCustomer?.id }, { where: { id: u_id } })
                const token = await stripe.tokens.create({
                    card: {
                        number: card_number,
                        exp_month: exp_month,
                        exp_year: exp_year,
                        cvc: cvc
                    }
                }, { stripeAccount: userProducts?.stripe_account_id });

                console.log('token==========', token)

                let paymentIntent = await stripe.paymentIntents.create(
                    {
                        payment_method_types: ['card'],
                        amount: amount * 100,
                        currency: 'usd',
                        application_fee_amount: 100,
                        customer: createCustomer?.id,
                        receipt_email: user?.email,
                        description: `${user?.first_name} buy these products ${product_name} on ${moment().format('MM-DD-YYYY HH:mm')}`
                    },
                    {
                        stripeAccount: userProducts?.stripe_account_id
                    }
                )

                let createPaymentMethod = await stripe.paymentMethods.create(
                    {
                        type: 'card',
                        card: {
                            token: token.id
                        }
                    },
                    {
                        stripeAccount: userProducts?.stripe_account_id
                    }
                )

                let completePayment = await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: createPaymentMethod.id }, { stripeAccount: userProducts?.stripe_account_id })

                if (completePayment) {
                    return {
                        status: true,
                        message: 'Payment successfull, Thank you!',
                        data: completePayment
                    }
                } else {
                    return {
                        status: false,
                        message: 'Failed to initialize payment'
                    }
                }
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error
        }
    }
}

export { 
    createCheckout, updateCheckout, getOrders, makePayment, connectToStripe, retriveAccount, removeConnectedAccount, addCard, myCards, 
    changDefaultPayment, deleteCard, processPayment, isMerchantConnected, initializPayment, processCashOnDelivery 
}
