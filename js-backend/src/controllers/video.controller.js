import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    if(!query || !query.trim()===""){
        throw new ApiError(400,"query is required")
    }

    const videos=await Video.aggregate(
        [
            {
                $match:{
                    $or:[
                        {
                            title:{$regex:query,$options:"i"}
                        },
                        {
                            description:{$regex:query,$options:"i"}
                        }
                    ]
                }
            },

            {
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"owner",
                    as:"owner",
                    pipeline:[
                        {
                            $project:{
                                avatar:1,
                                username:1,
                                fullName:1
                            }
                        }
                    ]
                }
            },

            {
                $project:{
                    videoFile:1,
                    thumnail:1,
                    owner:1,
                    _id:1,
                    title:1,
                    description:1,
                    views:1,
                    duration:1,
                    isPublished:1
                }
            },

            //sorting and pagination

            {
                $sort:{
                    [sortBy]:sortType==="asc"?1:-1
                }
            },

            {
                $skip:(page-1)*limit
            },
            {
                $limit:parseInt(limit)
            }
        ]
    );

    if(!videos.length){
        throw new ApiError(404,"no videos found from given query")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,videos,"videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if([title,description].some(fields=>fields?.trim()==="")){
        throw new ApiError(400,"title and description are required")
    }

    try {
        const videoFileLocalPath=req.files?.videoFile[0]?.path;

        const thumbnailLocalPath=req.files?.thumbnail[0]?.path;

        if(!videoFileLocalPath){
            throw new ApiError(401,"Video file local path is required")
        }

        if(!thumbnailLocalPath){
            throw new ApiError(401,"thumbnail file local path is required")
        }

        const videoFile=await uploadOnCloudinary(videoFileLocalPath)

        const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)

        if(!videoFile.url){
            throw new ApiError(400,"video file is required")
        }

        if(!thumbnail.url){
            throw new ApiError(400,"thumbnail file is required")
        }

        const video=await Video.create({
            title,
            description,
            thumbnail:thumbnail.url,
            videoFile:videoFile.url,
            thumbnail_public_id:thumbnail.public_id,
            videoFile_public_id:videoFile.public_id,
            duration:videoFile.duration,
            owner:req.user?._id
        })

        if(!video){
            throw new ApiError(500,"error while uploading the video")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "video successfully uploaded to database"
            )
        )
    } catch (error) {
        throw new ApiError(400,"error while uploading the video",error)
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"video id is not valid")
    }

    const video=await Video.aggregate(
        [
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(videoId) //convert string to objectid
                }
            },
            {
                $lookup:{
                    from:"likes",
                    localField:"_id",
                    foreignField:"video",
                    as:"likes"
                }
            },
            {
                $addFields:{
                    likesCount:{
                        $size:"$likes"
                    },

                    isLiked:{
                        $cond:{
                            if:{$in:[req.user?._id,"$likes.likedBy"]},
                            then:true,
                            else:false,
                        }
                    }
                }
            },

            {
                $lookup:{
                    from:"users",
                    foreignField:"_id",
                    localField:"owner",
                    as:"owner",
                    pipeline:[
                        {
                            $lookup:{
                                from:"subscriptions",
                                foreignField:"channel",
                                localField:"_id",
                                as:"subscribers"
                            }
                        },
                        {
                            $addFields:{
                                subscriberCount:{
                                    $size:"$subscribers"
                                },

                                isSubscribed:{
                                    $cond:{
                                        if:{$in:[req.user?._id,"subscribers.subscriber"]},
                                        then:true,
                                        else:false
                                    }
                                }
                            }
                        },

                        {
                            $project:{
                                fullName:1,
                                username:1,
                                avatar:1,
                                subscriberCount:1,
                                isSubscribed:1
                            }
                        }
                    ]
                }
            },
            
        ]
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}