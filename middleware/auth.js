const jwt=require("jsonwebtoken")
const config=require("config")

module.exports=function(req,res,next){
    const token=req.header("x-auth-token")

    if(!token){
        return res.status(401).json({message:"access denied"})
    }

    try {
        const decode=jwt.verify(token,config.get("jwtSecret"))
        req.user =decode.user
        next()
    } catch (error) {
        res.status(401).json({message:"server error"})
    }
}