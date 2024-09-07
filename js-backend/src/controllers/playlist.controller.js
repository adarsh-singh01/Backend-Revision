import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if(!name || name.trim()===""){
        throw new ApiError(400,"name is required")
    }

    const playlist=await Playlist.create({
        name,
        description:description||"",
        owner:req.user?._id,
    });

    if(!playlist){
        throw new ApiError(500,"error while creating playlist");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!userId||!isValidObjectId(userId)){
        throw new ApiError(400,"user id is not valid");
    }

    const playlists=await Playlist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId),
            }
        }
    ]);

    if(!playlists.length){
        throw new ApiResponse(404,"no playlists found for this user")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlists,"playlists fetched succesfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!playlistId||!isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist id");
    }

    const playlist=await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(500,"error while fetching playlist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"playlist fetched succesfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!playlistId|| !isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist id");
    }

    if(!videoId|| !isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video id")
    }

    const playlist = await Playlist.findById(videoId);

    if(!video){
        throw new ApiError(400,"video not found")
    }

    if(playlist?.owner.toString()!==req.user?.id.toString()){
        throw new ApiError(401,"you do not have permission to perform this action")
    }

    if(playlist.videos.includes(videoId)){
        throw new ApiError(400,"video already in playlist");
    }

    const addToPlaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet:{
                videos:videoId
            },
        },
        {new:true}
    );

    if (!addToPlaylist){
        throw new ApiError(500,"error while adding video to playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            addToPlaylist,
            "video added to playlist succesfully"
        )
    );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!playlistId|| !isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist id")
    }

    if(!videoId||!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video id");
    }

    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }

    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"video not found")
    }

    if(playlist?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(
            401,
            "you do not have permission to perform this action"
        )
    }

    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400,"video not in playlist")
    }

    const removeVideo=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos:{
                    $in:[`${videoId}`]
                }
            }
        },
        {new:true}
    );

    if(!removeVideo){
        throw new ApiError(
            500,
            "something went wrong while removing video from playlist"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            removeVideo,
            "video removed from playlist succesfully"
        )
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId||!isValidObjectId(playlistId)){
        throw new ApiError(400,"playlist not found")
    }

    const playlist=await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(
            401,
            "you do not have permission to do this action"
        )
    }

    const delPlaylist=await Playlist.findByIdAndDelete(playlistId)

    if(!delPlaylist){
        throw new ApiError(500,'error while deleting playlist')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,delPlaylist,"playlist deleted succesfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId||!isValidObjectId(playlistId)){
        throw new ApiError(400,"invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }

    if(!name&& !description){
        throw new ApiError(400,"atleast one of the field is required")
    }

    if(playlist?.owner.toString()!==req.user?.id.toString()){
        throw new ApiError(
            401,
            "you do not have permission to do this action"
        )
    }

    const updatedPlaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name:name || playlist?.name,
                description:description || playlist?.description,
            }
        },
        {new:true}
    );

    if(!updatedPlaylist){
        throw new ApiError(500,"error while updating playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "playlist updated succesfully"
        ))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}