import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(400,"channel id is not valid")
    }

    if(channelId.toString()===req.user?.id.toString()){
        throw new ApiError(400,"cannot subscribe to your own channel");
    }
    const isSubscribed=await Subscription.findOne({
        subscriber:req.user?._id,
        channel:channelId,
    });

    if(isSubscribed){
        const unsubscribe=await Subscription.findByIdAndDelete(isSubscribed);

        if(!unsubscribe){
            throw new ApiError(500,"error while unsubscribing");
        }
    } else {
        const subscribe=await Subscription.create({
            subscriber:req.user?._id,
            channel:channelId,
        });

        if (!subscribe){
            throw new ApiError(500,"error while subscribing");
        }
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{},"subscription toggled"));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId|| !isValidObjectId(channelId)){
        throw new ApiError(400,"channel id is not valid");
    }

    const subscribers=await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscribers"
            }
        },
        {
            $addFields:{
                subscribers:{
                    $first:"$subscribers",
                }
            }
        },
        {
            $group:{
                _id:null,
                subscribers:{$push:"$subscribers"},
                totalSubscribers:{$sum:1},
            },
        },
        {
            $project:{
                _id:0,
                subscribers:{
                    _id:1,
                    username:1,
                    avatar:1,
                    fullName:1,
                },
                subscribersCount:"$totalSubscribers",
            }
        }
    ]);

    if(!subscribers){
        throw new ApiError(401,"subscribers not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            "subscribers fetched succesfully"
        )
    );
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId||!isValidObjectId(subscriberId)){
        throw new ApiError(400,"no valid subscriber id found")
    }

    const subscribedChannels=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channels",
            }
        },
        {
            $addFields:{
                channels:{
                    $first:"$channels",
                }
            }
        },
        {
            $group:{
                _id:null,
                channels:{$push:"$channels"},
                totalChannels:{$sum:1},
            }
        },
        {
            $project:{
                _id:0,
                channels:{
                    _id:1,
                    username:1,
                    fullName:1,
                    avatar:1,
                },
                channelsCount:"$totalChannels",
            }
        }
    ]);

    if(!subscribedChannels){
        throw new ApiError(404,"channels not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            subscribedChannels,
            "subscribed channels fetched succesfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}