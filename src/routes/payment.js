const express = require('express');
const { userAuth } = require('../middleware/auth');
const paymentRouter  = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { Payment } = require("../modles/payment");
const { membershipAmount } = require("../utils/constant");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
const { User } = require('../modles/user');

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
      try {
          const {membershipType} = req.body;
          const {firstName, lastName, email} = req.user;

          const order = await razorpayInstance?.orders?.create({
             amount: membershipAmount[membershipType] * 100,  // Amount is in paise, so 50000 paise = 500 INR
             currency: "INR",
             receipt: "receipt#1",
             notes : {
                //notes is like meta data which you can send to razorpay and it will be returned back to you in the response
                firstName : firstName,
                lastName : lastName,
                membershipType : membershipType,
                emailId : email
             }
          })

          console.log("1818 ",order)

          const payment = new Payment({
            userId : req.user._id,
            orderId : order.id,
            amount : order.amount,
            currency : order.currency,
            receipt : order.receipt,
            notes : order.notes,
            status  :  order.status
          })
          const savedPayment = await payment.save();
          return res.json({ ...savedPayment.toJSON(),keyId : process.env.RAZORPAY_KEY_ID });
      }catch (err) {
        console.error("Error creating payment:", err);
        return res.status(500).json({ msg : err.message });
      }
})

paymentRouter.post("/payment/webhook", async (req, res) => {
    try { 
        const webhookSignature = req.get("X-Razorpay-Signature");
        const isWebhookValid =validateWebhookSignature(
            JSON.stringify(req.body), 
            webhookSignature, 
            process.env.WEB_HOOK_SECRET
        )

        if(!isWebhookValid) {
            return res.status(400).json({ msg : "Invalid webhook signature" });
        }
        
        //update my payment details in DB
        const paymentDetails = req.body.payload.payment.entity

        const payment = await Payment.findOne({orderId : paymentDetails.order_id});
        await payment.save()


        const user = await User.findOne({_id : payment.userId});
        user.isPremium = isThursdayWithOptions;
        user.membershipType = payment.notes.membershipType
        await user.save()

        return res.status(200).json({ msg : "Payment successful" });
    }catch (err) {

    }
})

module.exports = paymentRouter;
