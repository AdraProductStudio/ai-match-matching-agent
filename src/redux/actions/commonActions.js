import axiosInstance from "../../services/axiosInstance"
import { handleVerifyPhone } from "../slices/commonSlice"

export const handleVerifyPhoneAPI = (params, navigate) => async (dispatch) => {
    try {
        dispatch(handleVerifyPhone({ type: 'request' }))
        const payload = {
            "phone_number": `+91${params}`
        }
        const response = await axiosInstance.post('/send-otp', payload)
        console.log(response.data)
        sessionStorage.setItem("email_or_phone", `+91${params}`)
        // sessionStorage.setItem("email_id", response.data.email_id)

        console.log("response.data", response.data)

        dispatch(handleVerifyPhone({ type: 'response', data: response.data }))
        navigate('/verify-otp')
    } catch (error) {
        dispatch(handleVerifyPhone({ type: 'error' }))
    }
}