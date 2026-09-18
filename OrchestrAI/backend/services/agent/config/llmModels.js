import dotenv from "dotenv"
dotenv.config()
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import {ChatOpenRouter} from "@langchain/openrouter"
const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    
    // other params...
})
const openrouter = new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500
})


const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
    temperature: 0,
    maxRetries: 0
})

export const getModel = async (agent)=>{
    switch (agent) {
        case "chat":
            return groq
            break;
        case "search":
            return groq
        case "coding":
            return openrouter
        default:
            return groq;
    }
}