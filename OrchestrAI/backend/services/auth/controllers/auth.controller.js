import { getAuth } from "firebase-admin/auth"
import {app} from "../config/firebase.js"
import User from "../model/user.model.js"
import crypto from "crypto"
import redis from "../../../shared/redis/redis.js"

export const login = async (req,res)=>{
    try{
        const {token} = req.body
        const decoded  = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid:decoded.uid
        })

        if(!user){
            user= await User.create({
                firebaseUid:decoded.uid,
                name:decoded.name,
                email:decoded.email,
                avatar:decoded.picture
            })
        }
        //now we will create session for storing user's data for a longer time
        const sessionId = crypto.randomUUID()
        await redis.set(`session-${sessionId}`,JSON.stringify({
            userId:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
    }),"EX",7*24*60*60)
        res.cookie("session",sessionId,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000//for 7 days session creation
        })
        return res.status(200).json(user)
    }catch(err){
        return res.status(500).json({message:`Login error ${err}`})
    }
}

export const logOut = async (req,res)=>{
    try{
        const sessionId = req.cookies?.session
        await redis.del(`session-${sessionId}`)//clear redis session id

        res.clearCookie("session")//clear sesssion cookie
        return res.status(200).json({
            message:"logout successfully"
        })
    }catch(err){
        return res.status(500).json({message:`logout error ${err}`})
    }
}