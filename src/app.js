const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "virat",
        lastName: "kohli",
        email: "viratkohli@gmail.com",
        password: "virat@123",
    });

    try {
        await user.save();
        res.send("user adedd succesfully!!");
    }catch{
        res.status(400).send("error saving the data:" +erro.message);
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

