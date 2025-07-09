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

        // const response = await axiosInstance.post('/send-otp', payload)
        const response = await axiosInstance.post('/continue-with-mobile', payload)
        sessionStorage.setItem("phone_number", `+91${params}`)
        // sessionStorage.setItem("email_id", response.data.email_id)
        dispatch(handleVerifyPhone({ type: 'response', data: response.data }))
        navigate('/chat')
    } catch (error) {
        dispatch(handleVerifyPhone({ type: 'error' }))
    }
}