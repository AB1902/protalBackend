const express=require("express")
const router=express.Router()
const auth=require("../../middleware/auth")
const User=require("../../models/User")
const {check,validationResult}=require("express-validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const config=require("config")

router.get("/",auth,async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password")
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message:"server error"
        })
    }
})


//LOGIN ROUTE
router.post("/",[
   check("email","email is not valid").isEmail(),
    check("password","password is required").exists()
],async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password}= req.body
    try {
        //user exists?
        let user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user doesnt exist"})
        }
        
        //comparing password and hashed password
        const match=await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(400).json({message:"password invalid"})
        }

        //return jwt
        const payload={
            user:{
                id:user.id
            }
        }
        
        jwt.sign(payload,config.get("jwtSecret"),{
            expiresIn:7200
        },(err,token) => {
            if(err){
                throw err
                
            }
            res.json({token})
        })

    } catch (error) {
        console.error(error.message)
    }

})


module.exports=router