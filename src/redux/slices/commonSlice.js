import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
    name: "commonSlice",
    initialState: {
        username : "",
        password : "",
        confirmPassword : "",
    },
    reducers : {

    }
})

const { actions, reducer} = commonSlice
export const {} = actions

export default reducer