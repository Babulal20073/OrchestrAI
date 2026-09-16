import dotenv from "dotenv"
dotenv.config()
import {TavilySearch} from "@langchain/tavily"
import { includes } from "zod"

export const searchtool= new  TavilySearch({
    maxResults:5,
    topic:"general",
    includeImages:true
})
