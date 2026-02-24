import authModel from '../models/user.js' 
import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from "jsonwebtoken";

export const Register = async(req , res)=>{
    try {
        const {name , email , password} = req.body;
        if(!name || !email || !password){
            return res.status(400).send({success:false , message:"Field All Required"})
        }
        if(!validator.isEmail(email)){
            return res.status(401).send({success:false , message:"Invalid Email or password"})
        }
        const isExist = await authModel.findOne({email});
        if(isExist){
            return res.status(409).send({success:false , message:"User Already Exist"})
        }
 
        const hashPassword = await bcrypt.hash(password , 10)

        const newUser  = await authModel.create({
            name : name ,
            email : email,
            password : hashPassword,
        })
        const user = newUser.toObject();
        delete user.password

        const token = jwt.sign({ id: newUser._id },process.env.JWT_SECRET,{ expiresIn: "1d" });

        return res.status(201).send({success:true , message:"Register Successfully" , user , token})
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false , message:"Internal Server Error"})
    }
}


export const Login = async(req ,res)=>{
 try {

     const {email , password} = req.body;
      if( !email || !password){
            return res.status(400).send({success:false , message:"Field All Required"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).send({success:false , message:"Invalid Email or password"})
        }
        const isExist = await authModel.findOne({email});
        if(!isExist){
            return res.status(404).send({success:false , message:"User Not Found"})
        }
        const isMatch = await bcrypt.compare(password , isExist.password)
        if(!isMatch){
           return res.status(401).send({success:false , message:"Invalid Email or password"})
        }
        const token = jwt.sign({ id: isExist._id },process.env.JWT_SECRET,{ expiresIn: "1d" });
 
        const user = isExist.toObject();
        delete user.password;
        return res.status(200).send({success:true , message:"Login Successfully" , user , token})
 } catch (error) {
       console.log(error)
        return res.status(500).send({success:false , message:"Internal Server Error"})
 }
}

export const getAllUser = async (req, res) => {
  try {
    const users = await authModel.find();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found"
      });
    }

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message
    });
  }
};