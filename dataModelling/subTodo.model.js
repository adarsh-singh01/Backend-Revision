import mongoose from "mongoose"

const subTodoSchema=new mongoose.Schema(
    {
        content:{
            type:String,
            required:true
        },
        complete:{
            type:Boolean,
            default:false
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,//ye likhne pe ise pta lg jata h ki koi reference aane wala hai
            ref:"User"//modal name
        }
    },{timestamps:true})

export const SubTodo=mongoose.model("SubTodo",subTodoSchema)