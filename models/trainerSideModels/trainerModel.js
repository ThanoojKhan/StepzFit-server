const mongoose = require('mongoose')
const trainerSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    secondName:{
        type:String
    },
    email:{
        type:String,
    },
    d_o_b:{
        type:String
    },
    gender:{
        type:String,
    },
    phone:{
        type:Number,
    },
    department:{
        type:String,
    },
    certification:{
        type:String,
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
    },
    coverImage:{
        type:String,
    },
    addedDate:{
        type:String,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
})

module.exports = mongoose.model('Trainer',trainerSchema)