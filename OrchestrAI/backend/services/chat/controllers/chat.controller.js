import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req,res)=>{
    try{
        const userId = req.headers['x-user-id']
        console.log("userid",userId);
        const conversation = await Conversation.create({
            userId:userId
        }
        )
        return res.status(200).json(conversation)
    }catch(err){
        return res.status(500).json({message:`create conversation error ${err}`})
    }
}


export const getConversations = async (req,res)=>{
    try{
        const userId = req.headers['x-user-id']
        console.log("userid",userId);
        const conversations = await Conversation.find({
            userId:userId
        }
        ).sort({updatedAt:-1})
        return res.status(200).json(conversations)
    }catch(err){
        return res.status(500).json({message:`create conversation error ${err}`})
    }
}

export const updateConversation = async (req,res)=>{
    try{
        const {id,title}=req.body
        const conversations = await Conversation.findByIdAndUpdate(
            id,
            {
                title
            }
        )
        return res.status(200).json(conversations)
    }catch(err){
        return res.status(500).json({message:`update conversation error ${err}`})
    }
}




export const saveMessage  = async(req,res)=>{
    try{
        const {conversationId,role,content}=req.body
        const message = await Message.create({
            conversationId,
            content,
            role
        })
        return res.status(200).json(message)
    }catch(err){
        return res.status(500).json({message:`save message error ${err}`})
    }
}

export const getMessages = async(req,res)=>{
    try{
        
        const messages = await Message.find({
            conversationId:req.params.conversationId
        })
        return res.status(200).json(messages);
    }catch(err){
        return res.status(500).json({message:`get messages error ${err}`})
    }
}

