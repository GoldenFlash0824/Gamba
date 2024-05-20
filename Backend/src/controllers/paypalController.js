import paypal from "paypal-rest-sdk";
import PayPalTransaction from "../models/paypalTransaction.js";

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "CLIENT_ID",
  client_secret: "CLIENT_SECRET",
});

exports.createPayment = async (req, res) => {
  const amount = req.body.amount;
  const currency = req.body.currency;

  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    transactions: [
      {
        amount: {
          currency: currency,
          total: amount,
        },
        description: "Transaction description",
      },
    ],
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    },
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.log(error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
      const paypalTransaction = PayPalTransaction.build({
        transaction_id: payment.id,
        amount: payment.transactions[0].amount.total,
        currency: payment.transactions[0].amount.currency,
        status: payment.state,
      });
      paypalTransaction.save();
    }
  });
};

exports.executePayment = async (req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;

  const executePaymentData = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: 1.0,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    executePaymentData,
    async (error, payment) => {
      if (error) {
        console.log(error);
      } else {
        const paypalTransaction = await PayPalTransaction.findOne({
          where: { transaction_id: payment.id },
        });
        paypalTransaction.status = payment.state;
        paypalTransaction.save();
        res.render("success");
      }
    }
  );
};
