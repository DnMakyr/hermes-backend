import mongoose from "mongoose";

const config: any = {};
const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI as string,
      config
    );
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};

export default dbConnect;
