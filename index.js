const express= require('express');
const cors= require("cors");
const dotenv= require('dotenv');
const mongoose=require('mongoose');


//load env variables
dotenv.config({path:'./config/config.env'})

const app=express();
const port =process.env.PORT || 3000

mongoose.connect(process.env.DBURL,{useNewUrlParser:true,useUnifiedTopology:true},(err,connect)=>{
    if (err) console.log("error in connecting database");
    console.log("Database conection established");
        app.listen(port,()=> { 
            console.log(`Server listening on port ${port}`);
        })
})
app.use(cors());
app.use(express.json());
app.use('/user',require('./routes/users'))

app.get('/tests',(req,res)=>{
    res.send("hello world")
})


