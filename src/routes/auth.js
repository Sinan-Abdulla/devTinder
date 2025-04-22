const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require("../utiles/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req, res) => {

    try {
        validateSignUpData(req);
        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });

        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("error:" + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credential");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 900000),

            });
            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid credential");
        }

    } catch (error) {
        res.status(400).send("error:" + error.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token",null,{
            expires:new Date(Date.now()),
        });
        res.send("User logged out successfully");
    }catch{
        res.status(400).send("error");
    }
});


module.exports = authRouter;