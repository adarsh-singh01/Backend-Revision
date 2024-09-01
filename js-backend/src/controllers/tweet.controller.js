import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
     
    const content=req.body;
    const userId=req.user?._id;

    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }

    if(!content || !content.trim()===""){
        throw new ApiError(400,"content is required")
    }

    const tweet=await Tweet.create({
        content:content,
        owner:userId
    });

    if(!tweet){
        throw new ApiError(501,"error while creating tweet");
    }

    return res.
    status(200).
    json(new ApiResponse(
        200,
        tweet,
        "tweet created succesfully"
    ))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userId=req.params;

    if(!userId|| !isValidObjectId(userId)){
        throw new ApiError(400,"no valid user id found")
    }

    const tweets= await Tweet.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"tweet",
                as:"likes"
            }
        },
        {
            $addFields:{
                likesCount:{
                    $size:"$likes"
                }
            }
        },
        {
            $project:{
                _id:1,
                content:1,
                likesCount:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ]);

    if (!tweets?.length){
        throw new ApiError(404,"no tweets found for this user");
    }

    res.status(200).json(
        new ApiResponse(200,tweets,"tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const newTweet=req.body;
    const tweetId=req.params;

    if(!newTweet || !newTweet.trim()===""){
        throw new ApiError(400,"invalid tweet id");
    }

    //find the tweet with the given id;

    const oldTweet = await Tweet.findById(tweetId);

    if(!oldTweet){
        throw new ApiError(501,"tweet not found for given id");
    }

    const updatedTweet= await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{content:newTweet}
        },
        {
            new:true
        }
    );

    if(!updatedTweet){
        throw new ApiError(500,"error while updating the Tweet.")
    }

    return res.
    status(200).
    json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet succesfully updated"
        )
    )

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const tweetId=req.params;

    if(!tweetId|| !isValidObjectId(tweetId)){
        throw new ApiError(400,"invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(501,"tweet not found")
    }

    const deletedTweet= await Tweet.findByIdAndDelete(tweetId);

    if(!deletedTweet){
        throw new ApiError(500,"error while deleting the tweet")
    }

    return res.
    status(200).
    json(new ApiResponse(
        200,
        deletedTweet,
        "tweet deleted successfully"
    ))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}