const mongoose = require('mongoose')
require('dotenv').config()

module.exports.connectDb = ()=>{
    mongoose.connect(process.env.MONGOCONNECTION,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log('Database Connected');
    }).catch((err)=>{
        console.log(err+"Connection Failed");
    }) 
}

