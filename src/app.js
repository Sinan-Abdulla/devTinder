const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    console.log(req.body);

    const user = new User(req.body);

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

