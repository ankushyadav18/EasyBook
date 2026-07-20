import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Database connected");
  } catch (error) {
    console.log("❌ MongoDB Error");
    console.log(error);
  }
};

export default connectDB;