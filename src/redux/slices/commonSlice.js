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
                    break;
                case 'response':
                    state.loading = false
                    break;
                case 'error':
                    state.loading = false
                    break;
            }
        },
        handleErrors(state, action) {
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