
const mongoose = require("mongoose");



const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);



const connectDB = async ()=>{

 mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
})
.then(() => console.log("MongoDB Connected"))
.catch(err => {
    console.log("FULL ERROR:");
    console.log(err);
});
}

module.exports = connectDB;