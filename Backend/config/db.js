import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connect to DB ${conn.connection.host}`)
    } catch (error) {
        console.log("Error on MongoDB" , error)
    }
}

export default connectDB;