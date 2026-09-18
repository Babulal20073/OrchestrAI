import dotenv from "dotenv"
dotenv.config()
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    
    // other params...
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
            return groq
        default:
            return groq;
    }
}