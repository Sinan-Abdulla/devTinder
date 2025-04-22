const express = require('express');
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utiles/validation");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const users = req.user;

        res.send(users);
    } catch (error) {
        res.status(400).send("error: " + error.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("invalid request");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        console.log(loggedInUser);

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });

    } catch (err) {
        res.status(400).send("error: " + err.message);
    }
});


module.exports = profileRouter;