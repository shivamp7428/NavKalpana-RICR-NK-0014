import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './Config/db.js'
import dotenv from "dotenv";
import router from './route/authRoutes.js'
import courseRoutes from './route/courseRoutes.js'
import moduleRoutes from './route/moduleRoutes.js'
import lessonRoutes from './route/lessonRoutes.js'
import progressRoutes from './route/progressRoutes.js'

dotenv.config();
connectDB();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(morgan("combined"))
app.use("/api/router/auth",router)
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log("Server Running on port " , PORT)
})
