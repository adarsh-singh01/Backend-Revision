import mongoose from "mongoose"

const TodoSchema=new mongoose.Schema(
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
        },
        subTodos:[//yaha type:Array bhi likh skte the
            {//ye define kr rhe hai ki iss array me har object kaisa dikega
                type:mongoose.Schema.Types.ObjectId,
                ref:"SubTodo"
            }
        ]
    },{timestamps:true})

export const Todo=mongoose.model("Todo",TodoSchema)