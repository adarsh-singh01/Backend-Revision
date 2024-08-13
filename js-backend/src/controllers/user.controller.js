import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { upload } from '../middlewares/multer.middleware.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const registeredUser = asyncHandler(async(req,res)=>{
    //get user details from frontend
    //validation-not empty fields
    //check if user already exists-email,username
    //check for images,imp avatar
    //upload 'em to cloudinary
    //create user object-create entry in database
    //remove password & refresh token field from response
    //check for user creation
    //return response

    const {fullName,email,username,password}=req.body
    console.log("email:",email)

    // if(fullName==""){
    //     throw new ApiError(400,"fullname required") 
    // }


    if([fullName.email,username,password].some((field)=>
    field?.trim()===""
    )){
        throw new ApiError(400,"all fields required")
    }

    const existedUser=User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"user with email or username exist")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,'avatar is req')
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,'avatar is req')
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,//ye to paaka hai
        coverImage: coverImage?.url || "",//iska hume bilkul confirm ni hai
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user.id).select(
        "-password -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(500,"this is not u its our fault in creating user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfuly")
    )

    // res.status(200).json({
    //     message:"ok"
    // })
})

export {registeredUser}