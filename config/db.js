import mongoose from "mongoose";

export const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONOGO_URI);
  mongoose.set("strictQuery", false);

  console.log(
    `Database Connected:`.bgGreen,
    `${connect.connection.host}`.green.bold
  );
};
