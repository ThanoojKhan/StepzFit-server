const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    users:[
        {
            type: mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Messages"
    }
},
{
    timestamps:true
})

module.exports = mongoose.model('Chat',chatSchema)

