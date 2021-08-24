const express=require("express")
const router=express.Router()
const {check,validationResult}=require("express-validator")
const bcrypt=require("bcryptjs")
const User=require("../../models/User")
const jwt=require("jsonwebtoken")
const config=require("config")

router.post("/",[
    check("name","name is required").not().isEmpty(),
    check("email","email is not valid").isEmail(),
    check("password","password is weak").isLength({min:6})
],async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password}= req.body
    try {
        //user exists?
        let user= await User.findOne({email})
        if(user){
            return res.status(400).json({message:"user already exists"})
        }

        user=new User({
            name,email,password
        })

        //encrypt password
        const salt=await bcrypt.genSalt(10)
        user.password=await bcrypt.hash(password,salt)
        await user.save()
        // res.send("user registered successfully")

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