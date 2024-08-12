/*require('dotenv').config({path:'./env'})*/

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({path:'../env'})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server run at :${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection fail !!",err)
})







/*
const app=express()
//Jab bhi db connect kro use trycatch me daal do

( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR here :",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app chal rhi hai :${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ",error)
        throw error
    }
} )()
*/