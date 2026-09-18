import { createSlice } from "@reduxjs/toolkit";


const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:[],
        artifacts:[]
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages=action.payload
        },
        addMessage:(state,action)=>{
            state.messages.push(action.payload)
        },
        setArtifacts:(state,action)=>{
            state.artifacts=action.payload
        },
        clearMessages: (state) => {
        state.messages = []
        state.artifacts = []
        }
    }
})
export const {setMessages,addMessage,setArtifacts,clearMessages}=messageSlice.actions
export default messageSlice.reducer