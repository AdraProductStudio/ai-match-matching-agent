import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
    name: "commonSlice",
    initialState: {
        username: "",
        password: "",
        confirmPassword: "",
        verifyPhone: "",
        loading: false,
        error: {}
    },
    reducers: {
        handleVerifyPhoneInput(state, action) {
            const { name, value } = action.payload
            state[name] = value
        },
        handleVerifyPhone(state, action) {
            let type = action.payload
            switch (type) {
                case 'request':
                    state.loading = true
                case 'response':
                    state.loading = false

                case 'error':
                    state.loading = false
            }
        },
        handleErrors(state, action) {
            console.log("action.payload", action.payload)
            // state.error = action.payload
            state.error = {
                ...state.error,
                ...action.payload
            }
        }
    }
})

const { actions, reducer } = commonSlice
export const {
    handleVerifyPhoneInput,
    handleVerifyPhone,
    handleErrors
} = actions

export default reducer