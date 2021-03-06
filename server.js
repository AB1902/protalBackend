const express =require("express")
const app=express()
const connectDB=require("./config/db")

connectDB()

//middleware
app.use(express.json({extended:false}))

app.get("/",(req,res)=>{
    res.send("ehaslbcaobcasjpixkasxclas")
})


//routes
app.use("/api/users",require("./routes/api/users"))
app.use("/api/auth",require("./routes/api/auth"))
app.use("/api/intro",require("./routes/api/profile"))
app.use("/api/post",require("./routes/api/post"))


app.listen(PORT=1902,()=>{
    console.log("server started")
})