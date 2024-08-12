import {asyncHandler} from '../utils/asyncHandler.js';

const registeredUser = asyncHandler(async(req,res)=>{
    res.status(200).json({
        message:"ok"
    })
})

export {registeredUser}