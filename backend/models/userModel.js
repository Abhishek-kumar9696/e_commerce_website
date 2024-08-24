import { timeStamp } from "console";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,required:true,default:false},
    mobile: { type: String, required: true, unique: true }, // New mobile field
    otp: { type: String, required: false }, // New OTP field
    otpExpiry: { type: Date }, // OTP expiration time
},{
    timeStamp:true
})

userSchema.pre('save', async function (next) {
    try{
        //console.log("called before saving a user");
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(this.email,this.password);
        next();
    } catch(err){
        next(err);
    }
    // if (!this.isModified('password')) {
    //   next();
    // }
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
  });

//   userSchema.post('save', async function (next) {
//     try{
//         console.log("called after saving a user")
        
//     } catch(err){
//         next(err);
//     }
 
//   });


  
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  const User = mongoose.model('User', userSchema);
  export default User;