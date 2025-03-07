import mongoose from "mongoose";

type connectionResObj = {
  isConnected?: number;
};
const Connection: connectionResObj = {};
const dbConnection = async (): Promise<void> => {
  if (Connection.isConnected) {
    return;
  }
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI || "", {});
    Connection.isConnected = dbConnect.connections[0].readyState;
    console.log("Connection status", Connection.isConnected);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
export default dbConnection;
