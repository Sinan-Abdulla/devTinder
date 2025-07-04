const express = require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorpayInstance = require('../utiles/razorpay');
const Payment = require("../models/payment")
const User = require('../models/user');
const { membershipAmount } = require('../utiles/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

paymentRouter.post("/payment/Create", userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body;
        const { firstName, lastName, emailId } = req.user

        console.log("membershipType received:", membershipType);
        console.log("membershipAmount keys:", Object.keys(membershipAmount));


        if (!membershipAmount[membershipType]) {
            return res.status(400).json({ error: "Invalid membershipType or amount not found" });
        }

        console.log("User:", req.user);
        console.log("MembershipType:", membershipType);




        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipType] * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                firstName,
                lastName,
                emailId,
                membershipType: membershipType,
            },
        });
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        });
        const savedPayment = await payment.save();

        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Payment order creation failed" });

    }

})

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        console.log("Webhook Called");
        const webhookSignature = req.get("X-Razorpay-Signature");
        console.log("Webhook Signature", webhookSignature);

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            console.log("INvalid Webhook Signature");
            return res.status(400).json({ msg: "Webhook signature is invalid" });
        }
        console.log("Valid Webhook Signature");

        // Udpate my payment Status in DB
        const paymentDetails = req.body.payload.payment.entity;
        console.log("Webhook Event:", req.body.event);

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();
        console.log("Payment saved");

        const user = await User.findOne({ _id: payment.userId });
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        console.log("User saved");

        await user.save();

        // Update the user as premium

        // if (req.body.event == "payment.captured") {
        // }
        // if (req.body.event == "payment.failed") {
        // }

        // return success response to razorpay

        return res.status(200).json({ msg: "Webhook received successfully" });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (user.isPremium) {
            return res.json({ isPremium: true });
        } else {
            return res.json({ isPremium: false });
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
});

module.exports = paymentRouter;