const mongoose=require("mongoose")
const ProfileSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    
    about:{
        type:String
    }
})

module.exports= Profile=mongoose.model("profiles",ProfileSchema)