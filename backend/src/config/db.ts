import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    
    console.log(`[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
        console.error(`[database]: Error: ${error.message}`);
    } else {
        console.error(`[database]: Unknown error`);
    }
    process.exit(1); 
  }
};

export default connectDB;