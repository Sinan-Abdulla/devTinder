const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const http = require("http");





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
const initializeSocket = require("./utiles/socket");
const chatRouter = require("./routes/chat");



app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);



const server = http.createServer(app);
initializeSocket(server);



connectDB().then(() => {
    console.log("Database connection is established");
    server.listen(process.env.PORT, () => {
        console.log("server  is running on port 7777");
    });
})
    .catch(err => {
        console.log("Database connection failed");
    });

