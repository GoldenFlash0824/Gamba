// import Stripe from 'stripe'
// import db from '../models/index.js'
// import dotenv from 'dotenv'
// import {getUserIdFromToken} from '../utilities/authentication.js'
// dotenv.config()
// const stripe = new Stripe(process.env.SECRET_KEY)

// const makePayment = async (req) => {
//     try {
//         const u_id = await getUserIdFromToken(req)
//         let user_data = await db.User.findOne({
//             where: {
//                 id: u_id
//             }
//         })
//         const {amount} = req.body
//         let customer_create
//         let check_stripe_id = await db.User.findOne({
//             where: {
//                 email: user_data.email
//             }
//         })
//         if (!check_stripe_id) {
//             customer_create = await stripe.customers.create({
//                 email: user_data.email,
//                 // source: 'test',
//                 name: 'test name'
//             })
//         }
//         // Create a payment intent using the Stripe API
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount,
//             currency: 'usd',
//             payment_method_types: ['card'],
//             customer: customer_create.id
//         })
//         if (!check_stripe_id) {
//             await db.User.update(
//                 {
//                     stripe_id: paymentIntent.customer
//                 },
//                 {
//                     where: {
//                         email: email
//                     }
//                 }
//             )
//         }

//         // Payment successful
//         return {clientSecret: paymentIntent}
//     } catch (error) {
//         // Payment failed
//         throw new Error(error.message)
//     }
// }

// export {makePayment}
