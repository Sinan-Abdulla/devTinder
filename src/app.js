const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utiles/validation");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");





app.use(express.json());
app.use(cookieparser());


app.post("/signup", async (req, res) => {

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


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credential");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: '7d' });
            res.cookie("token", token ,{ expires: new Date(Date.now() + 900000),
                
            });
            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid credential");
        }

    } catch (error) {
        res.status(400).send("error:" + error.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const users = req.user;

        res.send(users);
    } catch (error) {
        res.status(400).send("error: " + error.message);
    }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log("sending a connection request");
        res.send(user.firstName + " has sent a connection request");
    } catch (error) {
        res.status(400).send("error: " + error.message);
    }
});


connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(7777, () => {
        console.log("server is running on port 7777");
    });
})
    .catch(err => {
        console.log("Database connection failed");
    });

