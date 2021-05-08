const mongoose = require('mongoose');
const config = require("config");

async function connectDB() {
    try {
        const connectionString = config.get("MongoURI");
        await mongoose.connect(connectionString, { useNewUrlParser: true });
        console.log('[+] MongoDB connected ...'.rainbow);
    } catch (err) {
        console.log(`error: ${err}`.red)
    }
}


module.exports = { connectDB }