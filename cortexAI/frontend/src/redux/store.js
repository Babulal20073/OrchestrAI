import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
//here we store/declare data inside reducer
//here data or stored unit is known as slice
export const store = configureStore({
    reducer:{
        user:userReducer
    },
})