import mongoose from "mongoose";
import {ServerApiVersion} from "mongodb";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI!,{
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
            }
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with a non-zero status code to indicate an error
    }
};


