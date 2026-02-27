import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import dotenv from "dotenv";
import router from './route/authRoutes.js'
import courseRoutes from './route/courseRoutes.js'
import moduleRoutes from './route/moduleRoutes.js'
import lessonRoutes from './route/lessonRoutes.js'
import progressRoutes from './route/progressRoutes.js'
import noteRoute from './route/noteRoutes.js'
import quizRoute from './route/quizRoutes.js'
import assignmentRoutes from './route/assignmentRoutes.js'
import submissionRoutes from './route/submitAssignment.js'
import messageRoutes from './route/messageRoutes.js'
import { Server } from 'socket.io';
import { setupSocket } from './socket/socketHandler.js';
import adminAuth from './route/AdminAuth.js'
import internshipRoutes from './route/InternshipRoute.js'
import applicationRoutes from './route/applicationRoutes.js'
import studentRoutes from './route/studentRoutes.js'

dotenv.config();
connectDB();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cors({origin: "https://nav-kalpana-ricr-nk-0014-wz7i.vercel.app/",credentials: true}));
app.use(morgan("combined"))
app.use("/api/router/auth",router)
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/notes",noteRoute);
app.use("/api/quiz" , quizRoute);
app.use('/api/assignments', assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use('/api/messages', messageRoutes);
app.use("/api/admin" , adminAuth);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use('/api', studentRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT , ()=>{
    console.log("Server Running on port " , PORT)
})

const io = new Server(server, {
  cors: {
    origin: '*',         
    methods: ['GET', 'POST']
  }
});

setupSocket(io);

