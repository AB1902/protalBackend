const mongoose=require("mongoose")
const config=require("config")
const e = require("express")
const db=config.get("mongoURI")


const connectDB=async()=>{
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify:true
        })
        console.log("db connected")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}


module.exports=connectDB
