import axios from "axios"
import {graph} from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import redis from "../../../shared/redis/redis.js"
export const agent = async (req,res)=>{
    try{
        const {prompt,conversationId,agent} = req.body

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,role:"user",content:prompt
        })
        const result = await graph.invoke({
            prompt,conversationId,agent
        })
        const response = result.aiResponse
        await addMessage({conversationId,role:"user",content:prompt})

        await addMessage({conversationId,role:"assistant",content:response})
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
            conversationId,role:"assistant",content:response
        })
        return res.status(200).json(response)
    }catch(err){
        console.error("AGENT ERROR:", err)
        console.error("ERROR RESPONSE:", err.response?.data)
        console.error("ERROR STATUS:", err.response?.status)
        return res.status(500).json({message:`agent error ${err}`})
    }
}