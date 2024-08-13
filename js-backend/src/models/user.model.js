import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema= new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
         },
         email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
         },
         fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
         },
         avatar:{
            type:String,//a url
            required:true,
         },
         coverImage:{
            type:String,
         },
         watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
         ],
         password:{
            type:String,
            required:[true,'password is compulsory']
         },
         refreshToken:{
            type:String
         }
    },{timestamps:true}
)

//Pre hook performs something just before saving to the db...iske and ()=>{} likhne se bache qki iske pass this ka reference nhi hota hai

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next()//neeche ka code tabhi chalega jb pass modify hoga
    this.password=await bcrypt.hash(this.password,10/*salt rounds*/)
    next()
})

//hum ab ek method bnaege ye dekhne k liye ki user ne jo pass diyaa hai wo stored pass k equal hai ya ni

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

//jwt is a bearer token jo b ise bear krega(jiske pass hoga) wo kuch maangenga to de denge
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id//ISME INFO KAM HOTI QKI baar baar refresh hota h
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)