const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }
}

export{asyncHandler}

//asyncHandler is a higher order func mtlb hum isme function bhi pass kr skte hai

// const asyncHandler=()=>{}
// const asyncHandler=(func)=>{()=>{}}//we can remove {}here
// const asyncHandler=(func)=> async ()=>{}

// const asyncHandler=(fn)=> async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }