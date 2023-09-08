const mongoose = require('mongoose')
const planSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:[String],
        required:true
    },
    type:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    imageSrc:{
        type: String,
    },
    isActive:{
        type: Boolean,
        default:false,
    },
    features: {
        type: [String]
    }
})

module.exports = mongoose.model('Plans',planSchema)