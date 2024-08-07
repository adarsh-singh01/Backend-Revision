import mongoose from "mongoose"

const doctorSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        salary:{
            type:String,
            required:true
        },
        qualification:{
            type:String,
            required:true
        },
        experienceInYears:{
            type:Number,
            default:0
        },
        worksInHospitals:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Hospital"
            }//agr no. of hours spent in a hospital bhi ho to ek naya schema bna k yaha daal denge ya phir yahi define kr denge
        ]
    },{timestamps:true});

export const Doctor=mongoose.model("Doctor",doctorSchema)