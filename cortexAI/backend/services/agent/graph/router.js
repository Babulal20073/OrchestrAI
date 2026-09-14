import { getModel } from "../config/llmModels.js"
import {z} from "zod"
const routerSchema = z.object({
    agent:z.enum([
        "chat",
        "search",
        "coding",
        "pdf",
        "ppt",
        "vision"
    ])
})
export const router = async(state)=>{
    const llm =  await getModel("router")
    const structuredLlm = llm.withStructuredOutput(routerSchema)

    const prompt =`
    You are an agent router.
    Available agents:
    - chat
    - search
    - coding
    - pdf
    - ppt
    - vision
    Rules:
    chat:
    General conversation,
    explanations,
    learning,
    question.

    search:
    Current events,
    latest information,
    news,
    recent developments,
    internet lookup.

    coding:
    Generate code,
    debug code,
    build projects,
    architecture,
    API design.
    
    pdf:
    Questions about generate PDFs
    or document context.

    ppt:
    Questions about generate ppts
    or ppt context.

    vision:
    Generate image,
    create image

    Return the selected agent in the required structured format.


    User Query:
    ${state.prompt}
    

    `
    const response=await structuredLlm.invoke(prompt)
    console.log(response)
    return {
        ...state,
        agent:response.agent

    }
}