import mongoose, { Schema } from "mongoose";
const StudetSchema = new Schema({
  regNo: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    unique: true,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
});

const student = mongoose.model("students", StudetSchema);
export default student;
