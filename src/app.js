const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
    res.send("user in logged in succesfully");
});

app.get("/user/data", userAuth, (req, res) => {
    res.send("user page");
});


app.get("/admin/dashboard", (req, res) => {
    res.send("welcome to dashboard");
});


app.get("/admin/getAllData", (req, res) => {
    res.send("get all data");
});



app.listen(7777, () => {
    console.log("server is running on port 7777");
});

