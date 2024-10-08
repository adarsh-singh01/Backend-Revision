import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json(
    {limit:'16kb'}
)) 

app.use(express.urlencoded({//yaha hum bta rhe hai ki url encode hoke aayegi dekh lena ...jaise kabhi jb google pe search kro to space ko wo %20 ya kuch likh deta hai
    extended:true,
    limit:'16kb'
}))

app.use(express.static("public"))


app.use(cookieParser())

//routes import
import userRouter from './routes/user.route.js'//manchaha naam tbhi de skte jb export default ho rha h

//routes declaration
app.use("/api/v1/users",userRouter)

//http://localhost:8000/api/v1/users/register
export {app}