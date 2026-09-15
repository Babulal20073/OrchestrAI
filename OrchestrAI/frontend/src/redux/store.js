import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import conversationReducer from "./conversationSlice"
import messageReducer from "./messageSlice"
//here we store/declare data inside reducer
//here data or stored unit is known as slice
export const store = configureStore({
    reducer:{
        user:userReducer,
        conversation:conversationReducer,
        message:messageReducer
    },
})