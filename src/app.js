const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config()


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})
);
app.use(express.json());
app.use(cookieparser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");



app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter );






connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(process.env.PORT, () => {
        console.log("server is running on port 7777");
    });
})
    .catch(err => {
        console.log("Database connection failed");
    });

