import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    refreshToken : {type:String},
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
},{timestamps:true});


const User = mongoose.model("User",userSchema);
export default User;