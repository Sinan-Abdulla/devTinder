const express = require("express");
const app = express();

app.use(
    "/user",
    [(req, res, next) => {
        console.log("handling the route user!!");
        //res.send("response!!");
        next();
    },
    (req, res, next) => {
        console.log("handling the route user 2!!");
        //res.send("2nd response!!");
        next();
    }],
    (req, res) => {
        console.log("handling the route user 3!!");
        res.send("3nd response!!");
    },
);




app.listen(7777, () => {
    console.log("server is running on port 7777");
});

