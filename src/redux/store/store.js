import { configureStore } from "@reduxjs/toolkit";
import commonReducer from '../slices/commonSlice'

const store = configureStore({
    reducer: {
        commonReducer: commonReducer
    }
})

export default store