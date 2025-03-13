const express = require("express");
const app = express();

app.use("/test",(req, res) => {
    res.send("hello from server!");
});


app.use("/hello", (req, res) => {
    res.send("hello helloo ");
});

app.use("/",(req,res)=>{
    res.send("namsthe kuttu");
});




app.listen(7777, () => {
    console.log("server is running on port 7777");
});

