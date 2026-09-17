import dotenv from "dotenv"
dotenv.config()
import {TavilySearch} from "@langchain/tavily"

export const searchtool= new  TavilySearch({
    maxResults:1,
    topic:"general",
    includeImages:true
})
