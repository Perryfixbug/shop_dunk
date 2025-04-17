const mongoose = require('mongoose')

module.exports.connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connect success!");
        
    }catch{
        console.log("Connect error!");
        
    }
}