import axiosInstance from "../../services/axiosInstance"
import { handleVerifyPhone } from "../slices/commonSlice"

export const handleVerifyPhoneAPI = (params, navigate) => async (dispatch) => {
    try {

        dispatch(handleVerifyPhone({ type: 'request' }))

        // const payload = {
        //     "phone_number": `+91${params}`
        // }
        const payload = {
            "phone_number": `+91${params}`,
            "email": sessionStorage.getItem("email_id")
        }

        const response = await axiosInstance.post('/continue-with-mobile', payload)
        console.log("response.data", response.data)
        if (response.data.error_code === 200) {
            dispatch(handleVerifyPhone({ type: 'response', data: response.data }))
            sessionStorage.setItem("phone_number", response.data.data.phone_number)
            sessionStorage.setItem("accessToken", response.data.data.token)
            sessionStorage.setItem("session_token", response.data.data.session_token)
            navigate('/chat')
        }

    } catch (error) {
        dispatch(handleVerifyPhone({ type: 'error' }))
    }
}