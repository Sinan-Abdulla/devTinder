const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const user = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
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

        /*
        const users = await user.find({email: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }*/




    } catch (err) {
        res.status(400).send("Error");
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

