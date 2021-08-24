const express=require("express")
const router=express.Router()
const auth=require("../../middleware/auth")
const Profile=require("../../models/Profile")
const User=require("../../models/User")
const {check,validationResult}=require("express-validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const config=require("config")

//get logged in user profiule
router.get("/me",auth,async(req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id}).populate("user",["name","email"])
        if(!profile){
            return res.status(400).json({message:"profile not found"})
        }
        return res.json(profile)

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message:"server error"})
    }
})

//create profile
router.post("/",[auth,[
    check("about","about is required").not().isEmpty()
]],async (req,res)=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()}) 
    }

    const about=req.body
    //building profile
    const profileField={}
    profileField.user=req.user.id

    if(about) 
        profileField.about=req.body.about
    try {
        //updating already existing
        let profile=await Profile.findOne({user:req.user.id})
        if(profile){
            profile=await Profile.findOneAndUpdate({user:req.body.user},{$set:profileField},{new:true})
            return res.json(profile)
        }
      

        //create a new
        profile=new Profile(profileField)
        await profile.save()
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("server error")
    }

})

module.exports=router