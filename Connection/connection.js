require('dotenv').config()
const mongoose = require("mongoose");


//Connect To DATABASE
async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL); //,{dbName:"<collectionName>"}
    // console.log("db Connected");
  } catch (error) {
    // console.log("error", error);
  }
}

module.exports = dbConnect;


