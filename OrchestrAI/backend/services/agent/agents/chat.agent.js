import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"

export const chatAgent = async (state)=>{
    console.log("CHAT STATE:", state)
    console.log("SEARCH RESULTS:", state.searchResults)     
    const llm = await getModel("chat")
    const history = await getMemory(state.conversationId)
    console.log(history)
    const searchResults = state.searchResults?.results?.map(result => ({
        title: result.title,
        url: result.url,
        content: result.content
    })) || []

    const searchContext = searchResults.length > 0
        ? `
    Web Search Results:

    ${JSON.stringify(searchResults, null, 2)}

    Answer the user using only the above search results.
    `
        : ""
    const systemPrompt = `
    You are contrexAI, an intelligent AI assistant
        ${JSON.stringify(state.searchResults, null, 2)}
    If searchContext exists:
    - Use search results to answer.
    - Do not mention internal tools.

    Rules:
    - For simple questions, greetings, and short queries, respond naturally in plain
    text.
    - For technical, educational, coding, or detailed topics, use clean Markdown.
    Formatting:
    - Use # for titles and ## for sections.
    - Leave a blank line after headings.
    - Use bullet points for lists.
    - Use numbered lists for steps.
    - Use fenced code blocks with language tags for code.
    - Keep paragraphs short and readable.
    - Never write headings and content on the same line.
    - Never generate large walls of text.
    `
    const messages=[
        new SystemMessage(systemPrompt)
    ]
    history.forEach(msg=>{
        if(msg.role=="user"){
            messages.push(new HumanMessage(msg.content))
        }else{
            messages.push(new AIMessage(msg.content))
        }
    })
    messages.push(new HumanMessage(state.prompt))
    console.log(messages)
    const response = await llm.invoke(messages)
    console.log("========== LLM RESPONSE ==========")
    console.log(response.content)

    console.log("========== LLM RESPONSE LENGTH ==========")
    console.log(response.content?.length)

    console.log("========== LLM RESPONSE METADATA ==========")
    console.log(response.response_metadata)
    return {
        ...state,
        aiResponse:response.content
    }
}