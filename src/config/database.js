const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://SinanAbdulla:ZpoNygBobw8PvZMD@namasthenode.4n82z.mongodb.net/devTinder"
    );
}

module.exports = connectDB;


