import { createSlice } from "@reduxjs/toolkit";
//reducers are like fxn to mange how we change our data
const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
    },
    reducers:{
        setUserdata:(state,action)=>{
            state.userData=action.payload
        }
    }
})
export const {setUserdata}=userSlice.actions
export default userSlice.reducer