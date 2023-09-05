const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    password:{
        type:String
    },
    profileImage:{
        type:String,
    },
    trainerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
    },
    planId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Plans',
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
})

module.exports = mongoose.model('User',userSchema)