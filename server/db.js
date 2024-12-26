const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/dbconnect");
    console.log(`mongodb connected successfully`);
  } catch (error) {
    console.log(`mongodb connection error ${error} `);
  }
};
module.exports = dbConnect;
