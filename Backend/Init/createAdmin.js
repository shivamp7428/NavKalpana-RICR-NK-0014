import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from '../models/Admin.js';

mongoose.connect("mongodb+srv://shivampatelpatel2005:Shivam123@cluster0.lok7w.mongodb.net/Navkalpana");

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("shivam", 10);

  await Admin.create({
    email: "shivampatelpatel2025@gmail.com",
    password: hashedPassword
  });

  console.log("✅ Admin created");
  process.exit();
};

createAdmin();
