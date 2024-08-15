import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registeredUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../controllers/auth.middleware.js";


const router=Router()

router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registeredUser)

router.route("/login").post(loginUser)

//secured routes
router.route('/logout').post(verifyJWT,logoutUser)//isliye verifyJWT me next likha tha jisse pta ho aage bhi kuch h execute krne ko

router.route("/refresh-token").post(refreshAccessToken)



export default router