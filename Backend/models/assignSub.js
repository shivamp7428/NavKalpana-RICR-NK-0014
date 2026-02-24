 import mongoose, { mongo } from "mongoose";


const submissionSchema = new mongoose.Schema({
  assignmentId:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true
  },
  studentId:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  textAnswer: { 
    type: String
  },
  fileUrl: {
    type: String 
  },          
  link: { 
    type: String
  },
  submittedAt:{ 
    type: Date, 
    default: Date.now },
  isLate: {
    type: Boolean, 
    default: false },
  status:{
    type: String, 
    enum: ['Not Submitted', 'Submitted', 'Evaluated'], 
    default: 'Not Submitted' },
  marks:{
    type: Number
  },
  feedback:{ 
    type: String
  }
},{
    timestamps:true
});


export default mongoose.model("AssignmentSubmission" , submissionSchema)