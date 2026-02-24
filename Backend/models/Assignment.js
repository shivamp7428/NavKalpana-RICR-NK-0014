import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
  title:{ 
    type: String,
    required: true 
  },
  description:{ 
    type: String, 
    required: true },
  deadline:{ 
    type: Date,  
    required: true },
  courseId:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' },
  totalMarks:{ 
    type: Number, 
    default: 100 },
  createdAt:{ 
    type: Date, 
    default: Date.now }
},{
    timestamps:true
});

export default mongoose.model("Assignment" , assignmentSchema)

