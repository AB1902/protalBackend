const express=require("express")
const router=express.Router()


router.get("/",(req,res)=>{
    res.status.send("users route")
})

module.exports=router