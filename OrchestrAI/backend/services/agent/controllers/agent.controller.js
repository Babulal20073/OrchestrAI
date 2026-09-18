import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"

export const agent = async (req, res) => {
    try {

        // Get request data FIRST
        const { prompt, conversationId, agent } = req.body

        // Save user message
        await axios.post(
            `${process.env.CHAT_SERVICE}/save-message`,
            {
                conversationId,
                role: "user",
                content: prompt
            }
        )

        // Run graph
        const result = await graph.invoke({
            prompt,
            conversationId,
            agent
        })

        const response = result?.aiResponse

        // Debug final response
        console.log("========== FINAL RESPONSE ==========")
        console.log("Response type:", typeof response)
        console.log("Response length:", response?.length)
        console.log(
            "Response first 500 chars:",
            response?.slice(0, 500)
        )
        console.log(
            "Response last 500 chars:",
            response?.slice(-500)
        )

        // Check images separately
        console.log(
            "IMAGE COUNT:",
            result.images?.length
        )

        console.log(
            "IMAGE PAYLOAD SIZE:",
            JSON.stringify(result.images || []).length
        )

        // Save user message to Redis memory
        await addMessage({
            conversationId,
            role: "user",
            content: prompt
        })

        // Assistant payload
        const payload = {
            conversationId,
            role: "assistant",
            content: response,
            images: result?.images,
            artifacts:result?.artifacts
        }

        console.log(
            "SAVE MESSAGE PAYLOAD SIZE:",
            JSON.stringify(payload).length
        )

        // Save assistant message to Redis
        await addMessage({
            conversationId,
            role: "assistant",
            content: response
        })

        // Save assistant message to MongoDB
        await axios.post(
            `${process.env.CHAT_SERVICE}/save-message`,
            payload
        )

        return res.status(200).json({
            answer: response,
            images: result.images,
            artifacts:result?.artifacts
        })

    } catch (err) {

        console.error("AGENT ERROR:", err)
        console.error("ERROR RESPONSE:", err.response?.data)
        console.error("ERROR STATUS:", err.response?.status)

        return res.status(500).json({
            message: `agent error ${err}`
        })
    }
}