const mongoose=require("mongoose");
const {Schema}=mongoose;
const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name is Required"]

    },
    
     email:{
        type:String,
        required:[true,"email is required"]
     },
     password:{
        type:String,
        requried:[true,"password is required"]
     },
     isAdmin: { type: Boolean, default: false }
})
module.exports  =mongoose.model('user',userSchema);
