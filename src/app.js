const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utiles/validation");
const bcrypt = require("bcrypt");



app.use(express.json());


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
            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid credential");
        }

    } catch (error) {
        res.status(400).send("error:" + error.message);
    }
});


app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        console.log("haii");

        const user = await User.find({});
        if (!user) {
            res.status(404).send({ message: "User not found" });
        } else {
            res.send(user);
        }


        const users = await user.find({ email: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }




    } catch (err) {
        res.status(400).send("Error");
    }
});


app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        console.log("sinan");
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted succesfully");
    } catch (err) {
        res.status(400).send("Error");
    }
})


connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(7777, () => {
        console.log("server is running on port 7777");
    });
})
    .catch(err => {
        console.log("Database connection failed");
    });

