import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './Config/db.js'
import dotenv from "dotenv";
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(morgan("combined"))


const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log("Server Running on port " , PORT)
})
