const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to MongoDB: ${con.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
