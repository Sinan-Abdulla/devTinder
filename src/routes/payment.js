const express = require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorpayInstance = require('../utiles/razorpay');
const payment = require("../models/payment");
const User = require('../models/user');
const { membershipAmount } = require('../utiles/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

paymentRouter.post("/payment/Create", userAuth, async (req, res) => {
    try {
        const { membershipType } = req.body;
        const { firstName, lastName, emailId } = req.user




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
        const Payment = new payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        });
        const savedPayment = await Payment.save();

        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Payment order creation failed" });

    }

})

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        console.log("webhook called");
        const webhookSignature = req.get("X-Razorpay-Signature");

        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            console.log("Invalid Webhook Signature");
            return res.status(400).json({ error: "Invalid webhook signature" });
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({ _id: payment.userId });
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;


        await user.save();

        //if (req.body.event === 'payment.captured') {
        //}
        //if (req.body.event === 'payment.failed') {
        //}

        return res.status(200).json({ msg: "Webhook received" });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});


module.exports = paymentRouter;