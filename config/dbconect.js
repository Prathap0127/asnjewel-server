import mongoose from "mongoose";

const DBConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected with Mongo ${conn.connection.host}`);
  } catch (error) {
    console.log(`Errors in DB ${error}`);
  }
};

export default DBConnect;
