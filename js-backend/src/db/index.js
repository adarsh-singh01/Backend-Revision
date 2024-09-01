import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongodb connected!! DBhOST :${connectionInstance.connection.host}`)
         
    } catch (error) {
        console.log("mongo connection error ",error)//agr pass me special char hai to b dikkate aati
        process.exit(1)//ye cheez nodejs ne diya hai ise import krne ki need nhi h
    }
}

export default connectDB;