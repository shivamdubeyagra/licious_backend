const mongoose = require("mongoose");
require("dotenv").config();

// const Connection = mongoose.connect(process.env.MONGO_URL);
// module.exports = Connection;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to the database`);
  } catch (error) {
    console.log(`Error connecting to the database ${error}`);
    process.exit(1);
  }
};
module.exports = connectDB;
