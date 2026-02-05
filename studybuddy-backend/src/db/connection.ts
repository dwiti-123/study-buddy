import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async () =>{
    try{
        if(!process.env.MONGODB_URI){
            throw new Error("'MONGO_URI is not defined in the environment variables.");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb connected successfully");
    }
    catch(error){
        console.log("Mongodb connection error:",error);
        process.exit(1);
    }
}

export default ConnectDB;